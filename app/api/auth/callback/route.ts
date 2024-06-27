import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/utils/encryption";

const { COGNITO_DOMAIN, COGNITO_APP_CLIENT_ID, COGNITO_APP_CLIENT_SECRET } =
  process.env;

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  const origin = request.nextUrl.origin;
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get("code") as string;

  if (!code) {
    const error = searchParams.get("error");
    return NextResponse.json({ error: error || "Unknown error" });
  }

  try {
    const codeVerifier = decrypt(cookieStore.get("code_verifier")?.value);
    const authorizationHeader = `Basic ${Buffer.from(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`).toString("base64")}`;

    const requestBody = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: COGNITO_APP_CLIENT_ID as string,
      code: code,
      redirect_uri: `${origin}/api/auth/callback`,
      code_verifier: codeVerifier,
    });

    console.log('checkpoint')

    const res = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authorizationHeader,
      },
      body: requestBody,
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({
        error: data.error,
        error_description: data.error_description,
      });
    }

    cookieStore.set("id_token", data.id_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: Date.now() + 3600000,
    });
    cookieStore.set("access_token", data.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: Date.now() + 3600000,
    });
    cookieStore.set("refresh_token", data.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: Date.now() + 2592000000,
    });

    return NextResponse.redirect(new URL("/", request.nextUrl));
  } catch (error) {
    return NextResponse.json({ error: error });
  }
}
