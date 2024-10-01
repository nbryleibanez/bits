import { type NextRequest, NextResponse } from "next/server";

const { COGNITO_DOMAIN, COGNITO_APP_CLIENT_ID, COGNITO_APP_CLIENT_SECRET } =
  process.env;

export async function POST(req: NextRequest) {
  try {
    const { refreshToken } = await req.json();
    const authorizationHeader = `Basic ${Buffer.from(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`).toString("base64")}`;

    const requestBody = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: COGNITO_APP_CLIENT_ID as string,
      refresh_token: refreshToken,
    });

    const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: authorizationHeader,
      },
      body: requestBody,
    });

    const tokenData = await response.json();

    if (tokenData.error)
      throw new Error(`${tokenData.error}: ${tokenData.error_description}`);

    const idToken: string = tokenData.id_token;
    const accessToken: string = tokenData.access_token;

    return NextResponse.json({ idToken, accessToken }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
