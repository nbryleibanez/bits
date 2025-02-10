import { type NextRequest, NextResponse } from "next/server";
import { ulid } from "ulid";
import { habitSchema } from "@/lib/schema";
import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
// import { CacheClient, CredentialProvider } from "@gomomento/sdk";

import { validateAccessToken } from "@/utils/auth/tokens";
import {
  createdResponse,
  badRequestResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const {
  DYNAMODB_TABLE_HABITS,
  DYNAMODB_TABLE_USERS,
  DYNAMODB_TABLE_HABIT_LOGS,
} = process.env;
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

    const timestamp = new Date().toISOString();
    const habitIdTimestamp = `${data.habit_id}_${timestamp}`;
    const createLogResponse = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABIT_LOGS,
        Item: {
          habit_id: { S: data.habit_id },
          timestamp: { S: timestamp.toString() },
          user_id: { S: payload.sub },
          habit_id_timestamp: { S: habitIdTimestamp },
          title: { S: data.title },
          habit_type: { S: data.habit_type },
          action: { S: "create" },
        },
      }),
    );

    if (createLogResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    // await cacheClient.delete("staging-habits", `user:${payload.sub}:habits`);
    return createdResponse({ habitId, habitType: type });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return internalServerErrorResponse();
  }
}
