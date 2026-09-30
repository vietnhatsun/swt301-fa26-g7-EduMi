import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/auth/logout/route";
import { SESSION_COOKIE_NAME } from "@/lib/auth-session";

describe("Authentication - Logout API (POST /api/auth/logout)", () => {
  it("TC-OUT-01: Đăng xuất thành công và xóa session cookie (maxAge = 0)", async () => {
    const res = await POST();
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe("Đăng xuất thành công.");

    // Kiểm tra header set-cookie đã thiết lập xóa cookie
    const setCookieHeader = res.headers.get("set-cookie");
    expect(setCookieHeader).not.toBeNull();
    expect(setCookieHeader).toContain(SESSION_COOKIE_NAME);
    // Khi xóa cookie, Next.js set maxAge=0 hoặc Expires trong quá khứ
    expect(setCookieHeader?.toLowerCase()).toMatch(/max-age=0|expires=/);
  });
});
