import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import crypto from "crypto";

import { encrypt } from "@/utils/encryption";

const { COGNITO_DOMAIN, COGNITO_APP_CLIENT_ID } = process.env;

export async function GET(request: NextRequest) {
  const cookieStore = cookies();
  let authorizeParams = new URLSearchParams();
  const origin = request.nextUrl.origin;

  try {
    const state = crypto.randomBytes(16).toString("hex");

    // Generate the PKCE code verifier and code challenge
    const codeVerifier = crypto.randomBytes(64).toString("base64url");
    const codeVerifierHash = crypto
      .createHash("sha256")
      .update(codeVerifier)
      .digest();
    const codeChallenge = codeVerifierHash
      .toString("base64url")
      .replace(/=+$/, "");

    authorizeParams.append("response_type", "code");
    authorizeParams.append("client_id", COGNITO_APP_CLIENT_ID as string);
    authorizeParams.append("redirect_uri", `${origin}/api/auth/callback`);
    authorizeParams.append("state", state);
    authorizeParams.append("identity_provider", "Google");
    authorizeParams.append("scope", "profile email openid aws.cognito.signin.user.admin");
    authorizeParams.append("code_challenge_method", "S256");
    authorizeParams.append("code_challenge", codeChallenge);

    // Encrypt the code verifier
    const encryptedCodeVerifier = encrypt(codeVerifier);
    cookieStore.set("code_verifier", encryptedCodeVerifier, { maxAge: 300 });

    return NextResponse.redirect(new URL(`${COGNITO_DOMAIN}/oauth2/authorize?${authorizeParams.toString()}`));
  } catch (error: any) {
    console.error(error);
  }
}
