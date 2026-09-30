import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/register/route";

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/mail", () => ({
  sendVerificationOtpEmail: vi.fn().mockResolvedValue({ success: true }),
}));

import { createServiceClient } from "@/lib/supabase";
import { sendVerificationOtpEmail } from "@/lib/mail";

describe("Authentication - Register API (POST /api/auth/register)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createJsonRequest = (body: Record<string, unknown>) => {
    return new NextRequest("http://localhost:3000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  describe("Validation Tests (Input Boundaries)", () => {
    it("TC-REG-02: Báo lỗi 400 nếu họ tên rỗng hoặc dưới 2 ký tự", async () => {
      const req = createJsonRequest({
        fullName: "A",
        email: "test@edumi.vn",
        password: "password123",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain("Họ và tên phải có tối thiểu 2 ký tự");
    });

    it("TC-REG-04: Báo lỗi 400 nếu email không đúng định dạng", async () => {
      const req = createJsonRequest({
        fullName: "Nguyễn Văn A",
        email: "invalid-email-format",
        password: "password123",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain("Địa chỉ email không hợp lệ");
    });

    it("TC-REG-03: Báo lỗi 400 nếu mật khẩu dưới 8 ký tự", async () => {
      const req = createJsonRequest({
        fullName: "Nguyễn Văn A",
        email: "test@edumi.vn",
        password: "12345",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain("Mật khẩu phải có tối thiểu 8 ký tự");
    });
  });

  describe("Conflict & State Tests", () => {
    it("TC-REG-05: Báo lỗi 409 khi email đã tồn tại và đã kích hoạt (is_verified = true)", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: "usr_existing",
              email: "student@edumi.vn",
              is_verified: true,
              password_hash: "hashed",
            },
            error: null,
          }),
        }),
      };
      (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

      const req = createJsonRequest({
        fullName: "Nguyễn Văn B",
        email: "student@edumi.vn",
        password: "securePassword123",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(409);
      expect(data.error).toContain("Email này đã được đăng ký tài khoản");
    });

    it("Báo lỗi 409 khi email đã đăng ký bằng Google (password_hash là null)", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: {
              id: "usr_google",
              email: "googleuser@gmail.com",
              is_verified: true,
              password_hash: null,
            },
            error: null,
          }),
        }),
      };
      (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

      const req = createJsonRequest({
        fullName: "Google User",
        email: "googleuser@gmail.com",
        password: "securePassword123",
      });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(409);
      expect(data.provider).toBe("google");
      expect(data.error).toContain("đăng ký bằng tài khoản Google");
    });
  });

  describe("Success Registration Flow", () => {
    it("TC-REG-01: Đăng ký học sinh mới thành công, tạo hồ sơ, sinh OTP và gửi mail xác thực", async () => {
      const mockInsertUser = { id: "new_usr_999" };
      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "users") {
            return {
              select: vi.fn().mockImplementation((sel: string) => {
                if (sel === "id") {
                  return {
                    single: vi.fn().mockResolvedValue({ data: mockInsertUser, error: null }),
                  };
                }
                return {
                  eq: vi.fn().mockReturnThis(),
                  maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }), // Chưa có user
                };
              }),
              insert: vi.fn().mockReturnThis(),
            };
          }
          if (table === "student_profiles") {
            return {
              insert: vi.fn().mockReturnThis(),
              select: vi.fn().mockResolvedValue({ data: [], error: null }),
            };
          }
          if (table === "verification_tokens") {
            return {
              update: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              insert: vi.fn().mockResolvedValue({ error: null }),
            };
          }
          return {
            insert: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
          };
        }),
      };
      (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

      const req = createJsonRequest({
        fullName: "Lê Hoàng Yến",
        email: "hoangyen@edumi.vn",
        password: "SuperSecretPassword2026",
        role: "student",
      });

      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(201);
      expect(data.success).toBe(true);
      expect(data.message).toContain("Mã xác thực OTP");
      expect(data.email).toBe("hoangyen@edumi.vn");

      // Đảm bảo hàm gửi mail OTP được gọi
      expect(sendVerificationOtpEmail).toHaveBeenCalledTimes(1);
    });
  });
});
