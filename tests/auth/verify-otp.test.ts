import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/verify-otp/route";

vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

import { createServiceClient } from "@/lib/supabase";

describe("Authentication - Verify OTP API (POST /api/auth/verify-otp)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createJsonRequest = (body: Record<string, unknown>) => {
    return new NextRequest("http://localhost:3000/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  describe("Validation Tests", () => {
    it("Báo lỗi 400 khi thiếu email hoặc mã OTP", async () => {
      const req = createJsonRequest({ email: "", otp: "123456" });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain("Vui lòng nhập đầy đủ email và mã OTP");
    });

    it("Báo lỗi 400 khi mã OTP không đúng độ dài 6 chữ số", async () => {
      const req = createJsonRequest({ email: "student@edumi.vn", otp: "123" });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain("mã OTP 6 chữ số");
    });
  });

  describe("Verification Flow & Security Tests", () => {
    it("TC-OTP-02: Báo lỗi 400 khi mã OTP không tồn tại hoặc đã được sử dụng", async () => {
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        }),
      };
      (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

      const req = createJsonRequest({ email: "student@edumi.vn", otp: "999999" });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain("Mã OTP không chính xác hoặc đã được sử dụng");
    });

    it("TC-OTP-03: Báo lỗi 400 khi mã OTP đã hết hạn (quá 10 phút)", async () => {
      const pastTime = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // Đã hết hạn 5 phút trước
      const mockSupabase = {
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({
            data: { id: "token_1", expires_at: pastTime, is_used: false },
            error: null,
          }),
        }),
      };
      (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

      const req = createJsonRequest({ email: "student@edumi.vn", otp: "654321" });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(400);
      expect(data.error).toContain("Mã OTP đã hết hạn");
    });

    it("TC-OTP-01: Xác thực thành công với OTP đúng, kích hoạt user và đánh dấu token đã dùng", async () => {
      const futureTime = new Date(Date.now() + 5 * 60 * 1000).toISOString(); // Còn hạn 5 phút
      const updateTokenMock = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });
      const updateUserMock = vi.fn().mockReturnValue({ eq: vi.fn().mockResolvedValue({ error: null }) });

      const mockSupabase = {
        from: vi.fn().mockImplementation((table: string) => {
          if (table === "verification_tokens") {
            return {
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              order: vi.fn().mockReturnThis(),
              limit: vi.fn().mockReturnThis(),
              maybeSingle: vi.fn().mockResolvedValue({
                data: { id: "valid_token_id", expires_at: futureTime, is_used: false },
                error: null,
              }),
              update: updateTokenMock,
            };
          }
          if (table === "users") {
            return {
              update: updateUserMock,
            };
          }
          return {};
        }),
      };
      (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

      const req = createJsonRequest({ email: "student@edumi.vn", otp: "123456" });
      const res = await POST(req);
      const data = await res.json();

      expect(res.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain("Xác thực tài khoản thành công");

      // Đảm bảo update trạng thái user is_verified = true
      expect(updateUserMock).toHaveBeenCalledWith(
        expect.objectContaining({
          is_verified: true,
          status: "active",
        })
      );

      // Đảm bảo token được mark is_used = true
      expect(updateTokenMock).toHaveBeenCalledWith({ is_used: true });
    });
  });
});
