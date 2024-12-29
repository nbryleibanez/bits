import { type NextRequest, NextResponse } from "next/server";
import { userSchema } from "@/lib/schema";
import { verifyToken, validateAccessToken } from "@/utils/auth/tokens";
import {
  badRequestResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

import {
  CognitoIdentityProviderClient,
  UpdateUserAttributesCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import {
  DynamoDBClient,
  PutItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const CognitoClient = new CognitoIdentityProviderClient({});

const { DYNAMODB_TABLE_USERS } = process.env;

export async function POST(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { username, firstName, lastName, sex, birthDate } =
      await request.json();

    const fullName = `${firstName} ${lastName}`;
    const accessToken = request.cookies.get("access_token")?.value as string;
    const idToken = request.cookies.get("id_token")?.value as string;
    const refreshToken = request.cookies.get("refresh_token")?.value as string;
    const idTokenPayload = await verifyToken(idToken, "id");

    // Check if username already exists
    try {
      const getItemResponse = await client.send(
        new QueryCommand({
          TableName: DYNAMODB_TABLE_USERS,
          IndexName: "username-index",
          KeyConditionExpression: "username = :username",
          ExpressionAttributeValues: {
            ":username": { S: username },
          },
        }),
      );

      if (getItemResponse.Count != 0)
        return badRequestResponse(
          "Username already exists. Please choose another one.",
        );
    } catch (error) {
      console.log("Error: ", error);
    }

    const { success, data } = userSchema.safeParse({
      user_id: payload.sub,
      username: username,
      email: idTokenPayload?.email,
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      sex: sex,
      birth_date: birthDate,
      avatar_url: idTokenPayload?.picture,
      created_date: new Date().toISOString(),
      habits: [],
      habits_requests: [],
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
          sex: { S: data.sex },
          birth_date: { S: data.birth_date },
          avatar_url: { S: data.avatar_url as string },
          created_date: { S: data.created_date },
          habits: { L: [] },
          habits_requests: { L: [] },
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
            Value: username,
          },
        ],
      }),
    );

    if (updateUserAttributesResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    const refreshTokenResponse = await fetch(
      `${process.env.SITE}/api/auth/refresh-tokens`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      },
    );

    const tokens = await refreshTokenResponse.json();
    const response = NextResponse.json(
      { message: "User creation successful." },
      { status: 201 },
    );
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
