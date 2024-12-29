import { type NextRequest } from "next/server";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
import { ulid } from "ulid";

import { validateAccessToken, validateIdToken } from "@/utils/auth/tokens";
import {
  okResponse,
  badRequestResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env;

export async function POST(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    const idTokenPayload = await validateIdToken(request);
    if (!payload || !idTokenPayload) return unauthorizedResponse();

    const { title, duoId, type } = await request.json();
    if (!title || !duoId || !type) return badRequestResponse();

    const habitId = ulid();

    const { $metadata } = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: duoId } },
        UpdateExpression:
          "SET habits_requests = list_append(habits_requests, :newHabitRequest)",
        ExpressionAttributeValues: {
          ":newHabitRequest": {
            L: [
              {
                M: {
                  habit_id: { S: habitId },
                  habit_type: { S: type },
                  title: { S: title },
                  duo_id: { S: payload.sub },
                  duo_name: { S: idTokenPayload.name as string },
                  duo_username: {
                    S: idTokenPayload["custom:username"] as string,
                  },
                  duo_avatar_url: { S: idTokenPayload.picture as string },
                },
              },
            ],
          },
        },
        ReturnValues: "NONE",
      }),
    );

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    return okResponse();
  } catch (error) {
    console.error("Error in POST handler: ", error);
    return internalServerErrorResponse();
  }
}
