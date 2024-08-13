// app/api/auth/signout/route.ts

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/utils/encryption";

const { COGNITO_DOMAIN, COGNITO_APP_CLIENT_ID, COGNITO_APP_CLIENT_SECRET } =
  process.env;

export async function GET(request: NextRequest) {
  const cookieStore = cookies();

  const idTokenExists = cookieStore.has("idToken");
  const accessTokenExists = cookieStore.has("accessToken");
  const refreshTokenExists = cookieStore.has("refreshToken");

  if (!refreshTokenExists) {
    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }

  const token = decrypt(cookieStore.get("refreshToken")?.value as string);
  const authorizationHeader = `Basic ${Buffer.from(`${COGNITO_APP_CLIENT_ID}:${COGNITO_APP_CLIENT_SECRET}`).toString("base64")}`;

  const response = await fetch(`${COGNITO_DOMAIN}/oauth2/revoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: authorizationHeader,
    },
    body: new URLSearchParams({
      token: token,
    }),
  });

  if (!response.ok) {
    const data = await response.json();

    return NextResponse.json({
      error: data.error,
      error_description: data.error_description,
    });
  }

  if (response.ok) {
    if (idTokenExists) {
      cookieStore.delete("idToken");
    }

    if (accessTokenExists) {
      cookieStore.delete("accessToken");
    }

    if (refreshTokenExists) {
      cookieStore.delete("refreshToken");
    }

    return NextResponse.redirect(new URL("/signin", request.nextUrl));
  }
}
