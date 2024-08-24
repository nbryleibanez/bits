import { NextResponse, type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/utils/encryption";
import redirectError from "@/utils/redirect-error";
import verifyToken from "@/utils/verify-token";

import {
  DynamoDBClient,
  QueryCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

const {
  COGNITO_DOMAIN,
  COGNITO_APP_CLIENT_ID,
  COGNITO_APP_CLIENT_SECRET,
  TABLE_USERS,
} = process.env;

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

    const tokenData = await response.json();

    if (!response.ok) {
      return redirectError(
        req,
        `${tokenData.error}: ${tokenData.error_description}`,
      );
    }

    cookieStore.set("idToken", tokenData.id_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: Date.now() + 3600000,
    });
    cookieStore.set("accessToken", tokenData.access_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: Date.now() + 3600000,
    });
    cookieStore.set("refreshToken", tokenData.refresh_token, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      expires: Date.now() + 2592000000,
    });

    if (cookieStore.has("code_verifier")) cookieStore.delete("code_verifier");

    try {
      const { payload, error } = await verifyToken(tokenData.id_token, "id");
      if (error) throw error;

      const command = new QueryCommand({
        TableName: TABLE_USERS,
        KeyConditionExpression: "userId = :userid",
        ExpressionAttributeValues: {
          ":userid": { S: payload?.sub as string },
        },
      });

      const userData = await client.send(command);

      if (userData.Count == 0) {
        return NextResponse.redirect(new URL("/onboarding", req.nextUrl));
      } else {
        return NextResponse.redirect(new URL("/", req.nextUrl));
      }
    } catch (e) {
      return redirectError(req, e);
    }
  } catch (e) {
    return redirectError(req, e);
  }
}
