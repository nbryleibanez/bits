import { type NextRequest } from "next/server";
import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { ulid } from "ulid";

import { habitSchema } from "@/lib/schema";
import { verifyToken, validateAccessToken } from "@/utils/auth/tokens";
import {
  createdResponse,
  badRequestResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const {
  DYNAMODB_TABLE_HABITS,
  DYNAMODB_TABLE_USERS,
  DYNAMODB_TABLE_HABIT_LOGS,
} = process.env;

export async function POST(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { title, cue, cueType, type } = await request.json();
    if (!title || !cue || !type || !cueType)
      return badRequestResponse("Missing required fields");

    const habitId = ulid();
    const dateNow = new Date().toISOString();
    const idToken = request.cookies.get("id_token")?.value as string;
    const idTokenPayload = await verifyToken(idToken, "id");

    const { data, success } = habitSchema.safeParse({
      habit_id: habitId,
      habit_type: type,
      owner: payload.sub,
      title: title,
      cue: cue,
      cueType: cueType,
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
          cue: { S: data.cue! },
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

    return createdResponse({ habitId, habitType: type });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return internalServerErrorResponse();
  }
}
