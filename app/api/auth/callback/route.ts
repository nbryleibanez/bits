import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { encrypt, decrypt } from "@/utils/encryption";
import redirectError from "@/utils/redirect-error";
import verifyToken from "@/utils/verify-token";

const { COGNITO_DOMAIN, COGNITO_APP_CLIENT_ID, COGNITO_APP_CLIENT_SECRET } =
  process.env;

export async function GET(req: NextRequest) {
  const cookieStore = cookies();
  const origin = req.nextUrl.origin;
  const searchParams = req.nextUrl.searchParams;
  const code = searchParams.get("code") as string;

  if (!code) {
    const error = searchParams.get("error");
    return NextResponse.json({ error: error || "Unknown error" });
  }

  try {
    const codeVerifier = decrypt(
      cookieStore.get("code_verifier")?.value as string,
    );
    const authorizationHeader = `Basic ${Buffer.from(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`).toString("base64")}`;

    const requestBody = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: COGNITO_APP_CLIENT_ID as string,
      code: code,
      redirect_uri: `${origin}/api/auth/callback`,
      code_verifier: codeVerifier,
    });

    const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authorizationHeader,
      },
      body: requestBody,
    });

    const data = await response.json();

    if (!response.ok) {
      return redirectError(req, `${data.error}: ${data.error_description}`);
    }

    const idToken = encrypt(data.id_token);
    const accessToken = encrypt(data.access_token);
    const refreshToken = encrypt(data.refresh_token);

    cookieStore.set("idToken", idToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: Date.now() + 3600000,
    });
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: Date.now() + 3600000,
    });
    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: Date.now() + 2592000000,
    });

    try {
      const { payload, error } = await verifyToken(data.access_token);
      if (error) throw error;

      const res = await fetch(
        `${req.nextUrl.origin}/api/users/${payload?.sub}`,
      );

      const d = await res.json();
      if (d.error) throw new Error(d.error);

      console.log(d);
    } catch (e) {
      return redirectError(req, e);
    }

    return NextResponse.redirect(new URL("/", req.nextUrl));
  } catch (e) {
    return redirectError(req, e);
  }
}
