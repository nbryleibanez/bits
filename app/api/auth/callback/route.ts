import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/utils/encryption";
import { setCookie } from "@/utils/set-cookie";
import redirectError from "@/utils/redirect-error";
import { verifyToken } from "@/utils/auth/tokens";

const { COGNITO_DOMAIN, COGNITO_APP_CLIENT_ID, COGNITO_APP_CLIENT_SECRET } = process.env;

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const origin = request.nextUrl.origin;
    const searchParams = request.nextUrl.searchParams;

    const encryptedCodeVerifier = cookieStore.get("code_verifier")?.value as string;
    const code = searchParams.get("code") as string;

    if (!code) {
      const error = searchParams.get("error");
      return NextResponse.json({ error: error || "Internal Server Error" }, { status: 500 })
    }

    if (!encryptedCodeVerifier) {
      return redirectError(request, "Cookie code_verifier not found. Please try again.")
    }

    const codeVerifier = decrypt(encryptedCodeVerifier);

    if (!codeVerifier) {
      return redirectError(request, "Code verifier not found. Please try again.")
    }

    const authorizationHeader = `Basic ${Buffer.from(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`).toString("base64")}`;
    const requestBody = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: COGNITO_APP_CLIENT_ID as string,
      code: code,
      redirect_uri: `${origin}/api/auth/callback`,
      code_verifier: codeVerifier,
    });

    // Exchange the authorization code for tokens
    const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authorizationHeader,
      },
      body: requestBody,
    });

    const tokenData = await response.json();

    if (!response.ok) {
      return redirectError(
        request,
        `${tokenData.error}: ${tokenData.error_description}`,
      );
    }

    setCookie(cookieStore, "id_token", tokenData.id_token, 3600);
    setCookie(cookieStore, "access_token", tokenData.access_token, 3600);
    setCookie(cookieStore, "refresh_token", tokenData.refresh_token, 2592000);

    if (cookieStore.has("code_verifier")) cookieStore.delete("code_verifier");

    const payload = await verifyToken(tokenData.id_token, "id");
    if (!payload) throw Error("Invalid token")

    // Check if the user is onboarded
    if (payload['custom:onboarded'] === 'false') return NextResponse.redirect(new URL("/onboarding", request.nextUrl));

    return NextResponse.redirect(new URL("/", request.nextUrl));
  } catch (e) {
    return redirectError(request, e);
  }
}
