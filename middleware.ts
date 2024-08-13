import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export function middleware(request: NextRequest) {
  const cookieStore = cookies();
  const path = request.nextUrl.pathname;

  const accessToken = cookieStore.get("accessToken");

  const protectedRoutes = ["/"];

  if (!accessToken && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  } else if (accessToken && path == "/signin") {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
