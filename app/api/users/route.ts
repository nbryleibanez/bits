import { type NextRequest, NextResponse } from "next/server";
import { cookies, headers } from "next/headers";
import verifyToken from "@/utils/verify-token";

import { CognitoIdentityProviderClient, UpdateUserAttributesCommand, VerifyUserAttributeCommand } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const CognitoClient = new CognitoIdentityProviderClient({});

const { DYNAMODB_TABLE_USERS } = process.env;

export async function GET(request: NextRequest) {
  return
}

export async function POST(req: NextRequest) {
  const headersList = headers();
  const operationType = headersList.get("operation-type");
  const cookieStore = cookies();

  if (!cookieStore.has("access_token")) {
    return new Response(
      JSON.stringify({
        message: "Unauthorized Access",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    const body = await req.json();
    const fullName = `${body.firstName} ${body.lastName}`;

    const idToken = cookieStore.get("id_token")?.value as string;
    const accessToken = cookieStore.get("access_token")?.value as string;
    const { payload, error } = await verifyToken(idToken, "id");

    if (error) throw new Error(error.toString());

    const res = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Item: {
          userId: { S: payload?.sub as string },
          username: { S: body.username },
          email: { S: payload?.email as string },
          firstName: { S: body.firstName as string },
          friends: { SS: [""] },
          fullName: { S: fullName as string },
          lastName: { S: body.lastName as string },
          profilePicUrl: { S: payload?.picture as string },
        },
      }),
    );

    if (res.$metadata.httpStatusCode == 200) {
      if (operationType === "Onboarding") {

        const updateUserAttributesCommand = new UpdateUserAttributesCommand({
          AccessToken: accessToken,
          UserAttributes: [
            {
              Name: "custom:onboarded",
              Value: "true",
            },
          ],
        });

        const updateUserAttributesResponse = await CognitoClient.send(updateUserAttributesCommand);

        console.log("updateUserAttributesResponse: ", updateUserAttributesResponse)


        if (updateUserAttributesResponse.$metadata.httpStatusCode !== 200) return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
        return NextResponse.json({ message: "Successful." }, { status: 200 })
      }

      return NextResponse.json({ message: "Successful." }, { status: 200 })
    }
  } catch (e: any) {
    console.log("Error: ", e)
    return new NextResponse(
      JSON.stringify({
        status: e.$metadata.httpStatusCode,
        message: `${e.message}`,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
