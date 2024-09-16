import { CognitoJwtVerifier } from "aws-jwt-verify";

const { COGNITO_POOL_ID, COGNITO_APP_CLIENT_ID } = process.env;

export async function verifyToken(token: string, tokenUse: string) {
  // Verifier that expects valid access tokens:
  const verifier = CognitoJwtVerifier.create({
    userPoolId: COGNITO_POOL_ID as string,
    tokenUse: tokenUse,
    clientId: COGNITO_APP_CLIENT_ID as string,
  });

  try {
    const payload = await verifier.verify(token);
    return payload;
  } catch (error) {
    console.log(error);
    return null;
  }
}
