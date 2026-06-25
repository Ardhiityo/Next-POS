import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const publicRoutes = ["/", "/auth/sign-in", "/auth/sign-up"];

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const pathName = request.nextUrl.pathname;
  const inOnAuthRoutes = pathName.startsWith("/auth");

  if (inOnAuthRoutes && sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const inOnProtectedRoutes = !publicRoutes.includes(pathName);

  if (inOnProtectedRoutes && !sessionCookie) {
    return NextResponse.redirect(new URL("/auth/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
