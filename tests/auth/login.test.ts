import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { POST } from "@/app/api/auth/login/route";
import bcrypt from "bcryptjs";
import * as authSession from "@/lib/auth-session";

// Mock các dependencies bên ngoài
vi.mock("@/lib/supabase", () => ({
  createServiceClient: vi.fn(),
}));

import { createServiceClient } from "@/lib/supabase";

describe("Authentication - Login API (POST /api/auth/login)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.NEXTAUTH_SECRET = "test-jwt-secret-key-edumi-swp391-2026";
  });

  const createJsonRequest = (body: Record<string, unknown>) => {
    return new NextRequest("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  };

  it("TC-LOG-02: Báo lỗi 400 khi thiếu email hoặc password", async () => {
    const req1 = createJsonRequest({ email: "", password: "password123" });
    const res1 = await POST(req1);
    const data1 = await res1.json();
    expect(res1.status).toBe(400);
    expect(data1.error).toContain("Vui lòng nhập đầy đủ Email và Mật khẩu");

    const req2 = createJsonRequest({ email: "student@edumi.vn", password: "" });
    const res2 = await POST(req2);
    const data2 = await res2.json();
    expect(res2.status).toBe(400);
    expect(data2.error).toContain("Vui lòng nhập đầy đủ Email và Mật khẩu");
  });

  it("TC-LOG-03: Báo lỗi 401 khi tài khoản không tồn tại trong hệ thống", async () => {
    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      }),
    };
    (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    const req = createJsonRequest({
      email: "notfound@edumi.vn",
      password: "password123",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toContain("Email hoặc mật khẩu không chính xác");
  });

  it("TC-LOG-05: Chặn 403 và yêu cầu xác thực OTP nếu tài khoản chưa kích hoạt", async () => {
    const mockUser = {
      id: "usr_123",
      email: "unverified@edumi.vn",
      is_verified: false,
      status: "pending_verification",
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
      }),
    };
    (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    const req = createJsonRequest({
      email: "unverified@edumi.vn",
      password: "password123",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.needVerification).toBe(true);
    expect(data.error).toContain("chưa được xác thực mã OTP");
  });

  it("TC-LOG-06: Chặn 403 khi tài khoản bị khóa (banned)", async () => {
    const mockUser = {
      id: "usr_banned",
      email: "banned@edumi.vn",
      is_verified: true,
      status: "banned",
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
      }),
    };
    (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    const req = createJsonRequest({
      email: "banned@edumi.vn",
      password: "password123",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(403);
    expect(data.error).toContain("đã bị khóa");
  });

  it("TC-LOG-07: Báo lỗi 400 nếu tài khoản tạo qua Google không có password_hash", async () => {
    const mockUser = {
      id: "usr_google",
      email: "googleuser@gmail.com",
      is_verified: true,
      status: "active",
      password_hash: null,
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
      }),
    };
    (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    const req = createJsonRequest({
      email: "googleuser@gmail.com",
      password: "password123",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toContain("đăng ký qua Google");
  });

  it("TC-LOG-04: Báo lỗi 401 khi nhập sai mật khẩu", async () => {
    const mockUser = {
      id: "usr_active",
      email: "student@edumi.vn",
      is_verified: true,
      status: "active",
      password_hash: await bcrypt.hash("correct-password", 10),
      role: "student",
    };

    const mockSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
      }),
    };
    (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    const req = createJsonRequest({
      email: "student@edumi.vn",
      password: "wrong-password",
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toContain("Email hoặc mật khẩu không chính xác");
  });

  it("TC-LOG-01: Đăng nhập thành công, trả về user info và set HTTP-Only Session Cookie", async () => {
    const rawPassword = "password123";
    const hashedPassword = await bcrypt.hash(rawPassword, 10);

    const mockUser = {
      id: "usr_student_01",
      email: "student@edumi.vn",
      full_name: "Trần Minh Đức",
      is_verified: true,
      status: "active",
      password_hash: hashedPassword,
      role: "student",
      avatar_url: null,
      phone_number: "0912345678",
    };

    const mockProfile = {
      user_id: "usr_student_01",
      student_code: "EDM-654321",
      current_streak: 5,
      longest_streak: 12,
      total_points: 350,
      schoolName: "THPT Chuyên",
      gradeLevel: "Lớp 12",
    };

    const mockSupabase = {
      from: vi.fn().mockImplementation((table: string) => {
        if (table === "users") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockUser, error: null }),
          };
        }
        if (table === "student_profiles") {
          return {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            maybeSingle: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
          };
        }
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
      }),
    };
    (createServiceClient as unknown as ReturnType<typeof vi.fn>).mockReturnValue(mockSupabase);

    const req = createJsonRequest({
      email: "student@edumi.vn",
      password: rawPassword,
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.user.email).toBe("student@edumi.vn");
    expect(data.user.fullName).toBe("Trần Minh Đức");
    expect(data.user.studentCode).toBe("EDM-654321");
    expect(data.user.role).toBe("student");

    // Kiểm tra Cookie edumi_session được thiết lập
    const setCookieHeader = res.headers.get("set-cookie");
    expect(setCookieHeader).toContain(authSession.SESSION_COOKIE_NAME);
  });
});
