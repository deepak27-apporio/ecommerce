import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("refreshToken")?.value;

  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/admin/dashboard");
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  // ❌ Not logged in → block dashboard
  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ❌ Logged in → block login/register
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/dashboard/:path*", "/login", "/register"],
};