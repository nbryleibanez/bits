import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const publicRoutes = ["/signin", "/signup"];

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const cookieStore = cookies();
  const path: string = req.nextUrl.pathname;

  const hasRefreshToken = cookieStore.has("refreshToken");

  if (
    !hasRefreshToken &&
    !publicRoutes.some((route: string) => path.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl));
  } else if (hasRefreshToken) {
    const hasAccessToken = cookieStore.has("accessToken");

    if (!hasAccessToken) {
      const refreshToken = cookieStore.get("refreshToken")?.value;

      const res = await fetch(`${req.nextUrl.origin}/api/auth/refresh-tokens`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      const data = await res.json();

      response.cookies.set("accessToken", data.accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: Date.now() + 3600000,
      });
      response.cookies.set("idToken", data.idToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        expires: Date.now() + 3600000,
      });
    }

    if (path == "/signin")
      return NextResponse.redirect(new URL("/", req.nextUrl));

    return response;
  }
  return response;
}

export const config = {
  matcher: [
    "/",
    "/signin",
    "/signup",
    "/onboarding",
    "/habit/:path*",
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
