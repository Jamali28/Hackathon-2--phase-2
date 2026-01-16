import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createAuthClient } from "better-auth/client";

const protectedRoutes = ["/dashboard", "/profile"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for the session token in cookies
  // Note: better-auth usually sets 'better-auth.session_token' (underscore or hyphen depends on config)
  // We check both specific variations to be safe
  const token = request.cookies.get("better-auth.session_token")?.value ||
                request.cookies.get("better-auth.session-token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !token) {
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes) - these should NOT be intercepted by auth middleware
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static (static assets)
     * - public (public assets)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|static|public).*)",
  ],
};
