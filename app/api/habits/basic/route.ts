import { type NextRequest, NextResponse } from "next/server";
import { ulid } from "ulid";
import { habitSchema } from "@/lib/schema";
import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
// import { CacheClient, CredentialProvider } from "@gomomento/sdk";

import { verifyToken, validateAccessToken } from "@/utils/auth/tokens";
import {
  createdResponse,
  badRequestResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const { DYNAMODB_TABLE_HABITS, DYNAMODB_TABLE_USERS } = process.env;
const client = new DynamoDBClient({});
// const cacheClient = await CacheClient.create({
//   credentialProvider: CredentialProvider.fromEnvVar("MOMENTO_API_KEY"),
//   defaultTtlSeconds: 3600,
// });

export async function POST(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { type, title } = await request.json();
    if (!type || !title) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const habitId = ulid();
    const dateNow = new Date().toISOString();
    const idToken = request.cookies.get("id_token")?.value as string;
    const idTokenPayload = await verifyToken(idToken, "id");

    const { data, success } = habitSchema.safeParse({
      habit_id: habitId,
      habit_type: type,
      owner: payload.sub,
      title: title,
      streak: 0,
      created_date: dateNow,
      participants: [
        {
          user_id: payload.sub,
          username: idTokenPayload?.["custom:username"] as string,
          full_name: idTokenPayload?.name as string,
          avatar_url: idTokenPayload?.picture as string,
          role: "owner",
          is_logged: false,
        },
      ],
    });

    if (!success) return badRequestResponse();

    const putItemResponse = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Item: {
          habit_id: { S: data.habit_id },
          habit_type: { S: data.habit_type },
          owner: { S: data.owner },
          title: { S: data.title },
          streak: { N: data.streak.toString() },
          created_date: { S: data.created_date },
          participants: {
            L: data.participants.map((participant) => ({
              M: {
                user_id: { S: participant.user_id },
                full_name: { S: participant.full_name },
                avatar_url: { S: participant.avatar_url },
                role: { S: participant.role },
                is_logged: { BOOL: participant.is_logged },
              },
            })),
          },
        },
      }),
    );

    if (putItemResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    const updateItemResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
        UpdateExpression: "SET habits = list_append(habits, :habit)",
        ExpressionAttributeValues: {
          ":habit": {
            L: [
              {
                M: {
                  habit_id: { S: habitId },
                  habit_type: { S: type },
                },
              },
            ],
          },
        },
      }),
    );

    if (updateItemResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    // await cacheClient.delete("staging-habits", `user:${payload.sub}:habits`);
    return createdResponse({ habitId, habitType: type });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return internalServerErrorResponse();
  }
}
