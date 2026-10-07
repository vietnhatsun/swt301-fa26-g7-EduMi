import { NextRequest, NextResponse } from "next/server";
import { getClaims, SESSION_COOKIE_NAME } from "@/lib/auth-session";
import { getRoleHomePath } from "@/lib/auth-roles";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  let claims = null;
  if (sessionCookie) {
    claims = await getClaims(sessionCookie);
  }

  const isProtectedPath =
    pathname.startsWith("/profile") ||
    pathname.startsWith("/parent") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/practice");

  if (isProtectedPath) {
    if (!claims) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      const response = NextResponse.redirect(loginUrl);
      if (sessionCookie) {
        response.cookies.delete(SESSION_COOKIE_NAME);
      }
      return response;
    }

    const roleHomePath = getRoleHomePath(claims.role);
    if (pathname.startsWith("/profile") && roleHomePath !== "/profile") {
      return NextResponse.redirect(new URL(roleHomePath, request.url));
    }

    if (pathname.startsWith("/parent") && claims.role !== "parent") {
      return NextResponse.redirect(new URL(roleHomePath, request.url));
    }

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

  const isAuthPath = pathname === "/login" || pathname === "/register";
  if (isAuthPath && claims) {
    return NextResponse.redirect(new URL(getRoleHomePath(claims.role), request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/profile/:path*",
    "/parent/:path*",
    "/dashboard/:path*",
    "/practice/:path*",
    "/login",
    "/register",
  ],
};
