import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/utils/encryption";
import { setSecureCookie } from "@/utils/set-secure-cookie";
import redirectError from "@/utils/redirect-error";
import verifyToken from "@/utils/verify-token";

const {
  COGNITO_DOMAIN,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
} = process.env;

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const origin = req.nextUrl.origin;
  const searchParams = req.nextUrl.searchParams;

  const encryptedCodeVerifier = cookieStore.get("code_verifier")?.value as string;
  const code = searchParams.get("code") as string;

  if (!code) {
    const error = searchParams.get("error");
    return NextResponse.json({ error: error || "Internal Server Error" }, { status: 500 })
  }

  if (!encryptedCodeVerifier) {
    return redirectError(req, "Cookie code_verifier not found. Please try again.")
  }

  try {
    const codeVerifier = decrypt(encryptedCodeVerifier);

    if (!codeVerifier) {
      return redirectError(req, "Code verifier not found. Please try again.")
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
        req,
        `${tokenData.error}: ${tokenData.error_description}`,
      );
    }

    setSecureCookie(cookieStore, "id_token", tokenData.id_token, 3600);
    setSecureCookie(cookieStore, "access_token", tokenData.access_token, 3600);
    setSecureCookie(cookieStore, "refresh_token", tokenData.refresh_token, 2592000);

    if (cookieStore.has("code_verifier")) cookieStore.delete("code_verifier");

    try {
      const { payload, error } = await verifyToken(tokenData.id_token, "id");

      if (error || payload === null) throw error;

      console.log(payload)

      // Check if the user is onboarded
      if (payload['custom:onboarded'] === 'false') return NextResponse.redirect(new URL("/onboarding", req.nextUrl));

      return NextResponse.redirect(new URL("/", req.nextUrl));
    } catch (e) {
      return redirectError(req, e);
      return NextResponse.json({ error: e }, { status: 500 })
    }
  } catch (e) {
    return redirectError(req, e);
  }
}
