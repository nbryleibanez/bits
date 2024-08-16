import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/", "/habit/*"];

export async function middleware(req: NextRequest) {
  const cookieStore = cookies();
  const path = req.nextUrl.pathname;

  const hasRefreshToken = cookieStore.has("refreshToken");

  if (!hasRefreshToken && protectedRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  } else if (hasRefreshToken) {
    const hasAccessToken = cookieStore.has("accessToken");
    if (!hasAccessToken) console.log("No access token");

    if (!hasAccessToken) {
      const refreshToken = cookies().get("refreshToken")?.value;

      const res = await fetch(`${req.nextUrl.origin}/api/auth/refresh-tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (res.ok) console.log("Ok");
    }

    if (path == "/signin")
      return NextResponse.redirect(new URL("/", req.nextUrl));

    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/onboarding",
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
