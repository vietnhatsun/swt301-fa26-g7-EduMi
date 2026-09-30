import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/resend-otp/route";

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

vi.mock("@/lib/mail", () => ({
  sendVerificationOtpEmail: vi.fn().mockResolvedValue({ success: true }),
}));

import { createServiceClient } from "@/lib/supabase";
import { sendVerificationOtpEmail } from "@/lib/mail";

describe("Authentication - Resend OTP API (POST /api/auth/resend-otp)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createJsonRequest = (body: Record<string, unknown>) => {
    return new NextRequest("http://localhost:3000/api/auth/resend-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  it("Báo lỗi 400 khi không cung cấp email", async () => {
    const req = createJsonRequest({ email: "" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Vui lòng cung cấp email");
  });

  it("Báo lỗi 404 khi email không tồn tại trong hệ thống", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    };
    (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    const req = createJsonRequest({ email: "unknown@edumi.vn" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(404);
    expect(data.error).toContain("Không tìm thấy thông tin đăng ký");
  });

  it("Báo lỗi 400 nếu tài khoản đã được kích hoạt trước đó", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({
          data: { id: "usr_1", is_verified: true },
          error: null,
        }),
      }),
    };
    (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    const req = createJsonRequest({ email: "verified@edumi.vn" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("Tài khoản này đã được xác thực trước đó");
  });

  it("Gửi lại mã OTP thành công, vô hiệu hóa mã cũ và gửi email mới", async () => {
    const updateTokensMock = vi.fn().mockReturnValue({
      eq: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    });
    const insertTokenMock = vi.fn().mockResolvedValue({ error: null });

    const mockSupabase = {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "users") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({
              data: {
                id: "usr_pending",
                full_name: "Lê Văn C",
                role: "student",
                is_verified: false,
              },
              error: null,
            }),
          };
        }
        if (table === "verification_tokens") {
          return {
            update: updateTokensMock,
            insert: insertTokenMock,
          };
        }
        return {};
      }),
    };
    (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    const req = createJsonRequest({ email: "pending@edumi.vn" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toContain("Mã xác thực mới đã được gửi");

    // Đảm bảo hàm gửi mail OTP được gọi
    expect(sendVerificationOtpEmail).toHaveBeenCalledTimes(1);
    expect(sendVerificationOtpEmail).toHaveBeenCalledWith(
      "pending@edumi.vn",
      expect.any(String),
      "Lê Văn C",
      "student"
    );
  });
});
