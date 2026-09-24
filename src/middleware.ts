import { NextRequest, NextResponse } from "next/server";
import { getClaims, SESSION_COOKIE_NAME } from "@/lib/auth-session";

/**
 * Next.js Middleware - Chạy trên Edge Runtime
 * Tự động chặn và kiểm tra Claims bảo mật trước khi bất kỳ HTML/Component nào được render.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // Trích xuất và xác thực chữ ký Claims
  let claims = null;
  if (sessionCookie) {
    claims = await getClaims(sessionCookie);
  }

  // 1. Kiểm tra nếu đang truy cập các trang yêu cầu đăng nhập (như /profile, /dashboard, /practice,...)
  const isProtectedPath =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/practice");

  if (isProtectedPath) {
    // Nếu không có Token hoặc Token bị giả mạo / hết hạn
    if (!claims) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      // Xóa cookie rác nếu token không hợp lệ
      if (sessionCookie) {
        response.cookies.delete(SESSION_COOKIE_NAME);
      }
      return response;
    }

    // Role-based Access Control (RBAC):
    // Giai đoạn này ưu tiên role student cho trang profile học sinh
    if (claims.role !== "student") {
      // Có thể chuyển hướng đến dashboard tương ứng với role (VD: teacher/parent) trong tương lai
      console.log(`[Middleware RBAC]: User role is ${claims.role}`);
    }

    // Forward các claims cần thiết qua header để Server Components bên dưới dùng ngay
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-user-id", claims.sub);
    requestHeaders.set("x-user-email", claims.email);
    requestHeaders.set("x-user-role", claims.role);
    requestHeaders.set("x-user-name", encodeURIComponent(claims.fullName));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // 2. Nếu đã đăng nhập thành công mà còn truy cập lại trang /login hoặc /register
  const isAuthPath = pathname === "/login" || pathname === "/register";
  if (isAuthPath && claims) {
    // Đã có phiên hợp lệ -> chuyển thẳng vào /profile
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Áp dụng middleware cho:
     * - /profile và mọi route con
     * - /login
     * - /register
     */
    "/profile/:path*",
    "/dashboard/:path*",
    "/practice/:path*",
    "/login",
    "/register",
  ],
};
