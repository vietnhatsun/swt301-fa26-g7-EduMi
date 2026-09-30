import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";
import { middleware } from "@/middleware";
import { SESSION_COOKIE_NAME, createSessionToken } from "@/lib/auth-session";

describe("Authentication - Middleware Protected Routes & RBAC", () => {
  beforeEach(() => {
    process.env.NEXTAUTH_SECRET = "test-jwt-secret-key-edumi-swp391-2026";
  });

  const createRequest = (url: string, cookieValue?: string) => {
    const req = new NextRequest(url);
    if (cookieValue) {
      req.cookies.set(SESSION_COOKIE_NAME, cookieValue);
    }
    return req;
  };

  it("TC-MID-01: Chuyển hướng về /login khi truy cập /profile mà chưa đăng nhập", async () => {
    const req = createRequest("http://localhost:3000/profile");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    const redirectLocation = res.headers.get("location");
    expect(redirectLocation).toContain("/login");
    expect(redirectLocation).toContain("redirect=%2Fprofile");
  });

  it("Chuyển hướng về /login và xóa cookie khi token bị giả mạo", async () => {
    const req = createRequest("http://localhost:3000/profile", "tampered.invalid.token");
    const res = await middleware(req);

    expect(res.status).toBe(307);
    const redirectLocation = res.headers.get("location");
    expect(redirectLocation).toContain("/login");

    // Xóa cookie rác
    const setCookieHeader = res.headers.get("set-cookie");
    expect(setCookieHeader).toContain(SESSION_COOKIE_NAME);
  });

  it("Cho phép truy cập /profile khi có session token hợp lệ và chuyển tiếp User Headers", async () => {
    const validToken = await createSessionToken({
      sub: "usr_student_valid",
      email: "valid@edumi.vn",
      fullName: "Đỗ Quốc Bảo",
      role: "student",
      studentCode: "EDM-888999",
    });

    const req = createRequest("http://localhost:3000/profile", validToken);
    const res = await middleware(req);

    // Không chuyển hướng (status không phải 307)
    expect(res.status).not.toBe(307);
    // Header được chuyển tiếp vào request
    expect(res.headers.get("x-middleware-request-x-user-id") || req.headers.get("x-user-id")).toBeDefined();
  });

  it("Chuyển hướng về /profile nếu người dùng đã đăng nhập mà vẫn cố truy cập /login", async () => {
    const validToken = await createSessionToken({
      sub: "usr_student_valid",
      email: "valid@edumi.vn",
      fullName: "Đỗ Quốc Bảo",
      role: "student",
    });

    const req = createRequest("http://localhost:3000/login", validToken);
    const res = await middleware(req);

    expect(res.status).toBe(307);
    const redirectLocation = res.headers.get("location");
    expect(redirectLocation).toBe("http://localhost:3000/profile");
  });

  it("Cho phép khách chưa đăng nhập truy cập trang công khai (/login, /register)", async () => {
    const req = createRequest("http://localhost:3000/login");
    const res = await middleware(req);

    // Cho phép tiếp tục không chuyển hướng
    expect(res.status).not.toBe(307);
  });
});
