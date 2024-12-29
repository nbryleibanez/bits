import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth/tokens";

const publicRoutes = ["/signin", "/signup"];

export async function middleware(req: NextRequest) {
  const response = NextResponse.next();
  const cookieStore = await cookies();
  const path: string = req.nextUrl.pathname;
  const hasRefreshToken = cookieStore.has("refresh_token");

  if (
    !hasRefreshToken &&
    !publicRoutes.some((route: string) => path.startsWith(route))
  ) {
    return NextResponse.redirect(new URL("/signin", req.nextUrl)); // Redirect to sign in if refresh token is missing
  } else if (hasRefreshToken) {
    const hasAccessToken = cookieStore.has("access_token");
    const accessTokenValue = cookieStore.get("access_token")?.value as string;
    const idTokenValue = cookieStore.get("id_token")?.value as string;
    const idTokenPayload = await verifyToken(idTokenValue, "id");

    // if there's no access token
    if (!accessTokenValue || !hasAccessToken) {
      const refreshToken = cookieStore.get("refresh_token")?.value;

      // refresh tokens
      const { idToken, accessToken } = await fetch(
        `${req.nextUrl.origin}/api/auth/refresh-tokens`,
        {
          method: "POST",
          headers: {
            Cookie: cookieStore.toString(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refreshToken }),
        },
      ).then((res) => res.json());

      // set tokens
      response.cookies.set("id_token", idToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 3600,
      });
      response.cookies.set("access_token", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 3600,
      });
    }

    // if user is in signin page, redirect to home if user has access token
    if (path == "/signin")
      return NextResponse.redirect(new URL("/", req.nextUrl));

    const username = idTokenPayload?.["custom:username"];
    if (path == `/user/${username}`)
      return NextResponse.redirect(new URL("/user/me", req.nextUrl));
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
    "/user/:path*",
    "/friends",
    "/create",
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
