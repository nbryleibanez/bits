import { type NextRequest, NextResponse } from "next/server";
import { userSchema } from "@/lib/schema";
import { verifyToken } from "@/utils/verify-token";
import { validateRequest } from "@/helpers/auth/validate-request";
import { badRequestResponse, unauthorizedResponse, internalServerErrorResponse } from "@/helpers/http/responses";

import { CognitoIdentityProviderClient, UpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";
import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const CognitoClient = new CognitoIdentityProviderClient({});

const { DYNAMODB_TABLE_USERS } = process.env;

export async function POST(request: NextRequest) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

    const body = await request.json();
    const fullName = `${body.firstName} ${body.lastName}`;
    const accessToken = request.cookies.get("access_token")?.value as string;
    const idToken = request.cookies.get("id_token")?.value as string;
    const refreshToken = request.cookies.get("refresh_token")?.value as string;
    const idTokenPayload = await verifyToken(idToken, "id");

    if (!body.username || !body.firstName || !body.lastName) return badRequestResponse();

    try {
      const getItemResponse = await client.send(
        new QueryCommand({
          TableName: DYNAMODB_TABLE_USERS,
          IndexName: "username-index",
          KeyConditionExpression: "username = :username",
          ExpressionAttributeValues: {
            ":username": { S: body.username },
          },
        })
      )

      if (getItemResponse.Count != 0) return badRequestResponse("Username already exists. Please choose another one.");
    } catch (error) { console.log("Error: ", error); }

    const { success, data } = userSchema.safeParse({
      user_id: payload.sub,
      username: body.username,
      email: idTokenPayload?.email,
      first_name: body.firstName,
      last_name: body.lastName,
      full_name: fullName,
      avatar_url: idTokenPayload?.picture,
      created_date: new Date().toISOString(),
      friends: [],
      friend_requests: [],
    });

    if (!success || !data) return badRequestResponse();

    const { $metadata } = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Item: {
          user_id: { S: data.user_id },
          username: { S: data.username },
          email: { S: data.email },
          first_name: { S: data.first_name },
          last_name: { S: data.last_name },
          full_name: { S: data.full_name },
          avatar_url: { S: data.avatar_url as string },
          created_date: { S: data.created_date },
          friends: { L: [] },
          friend_requests: { L: [] },
        },
      }),
    );

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    const updateUserAttributesResponse = await CognitoClient.send(
      new UpdateUserAttributesCommand({
        AccessToken: accessToken,
        UserAttributes: [
          {
            Name: "custom:onboarded",
            Value: "true",
          },
          {
            Name: "custom:username",
            Value: body.username,
          }
        ],
      })
    );

    if (updateUserAttributesResponse.$metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    const refreshTokenResponse = await fetch(`${process.env.SITE}/api/auth/refresh-tokens`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const tokens = await refreshTokenResponse.json();
    const response = NextResponse.json({ message: "User creation successful." }, { status: 201 });
    response.cookies.set("access_token", tokens.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 3600,
    });
    response.cookies.set("id_token", tokens.idToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 3600,
    });

    return response;
  } catch (error: any) {
    console.error("Error in POST handler: ", error);
    return internalServerErrorResponse();
  }
}
