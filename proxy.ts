import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const { pathname } = request.nextUrl;

  const isDashboard = pathname.startsWith("/admin/dashboard");
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/register");
  const isCheckoutPage = pathname.startsWith("/checkout");

  if ((isDashboard || isCheckoutPage) && !refreshToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/login",
    "/register",
    "/checkout/:path*",
  ],
};
