import { NextRequest } from "next/server";
import { DynamoDBClient, GetItemCommand, BatchGetItemCommand } from "@aws-sdk/client-dynamodb";

import { validateAccessToken } from "@/utils/auth/tokens";
import { okResponse, unauthorizedResponse, internalServerErrorResponse } from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS, DYNAMODB_TABLE_HABITS } = process.env;

/*
  Get all habits for the authenticated user
*/
export async function GET(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const getUserResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
        ProjectionExpression: "habits"
      })
    );

    if (
      getUserResponse.$metadata.httpStatusCode !== 200 ||
      !getUserResponse.Item
    ) return internalServerErrorResponse();

    const habits = getUserResponse.Item.habits.L || [];

    const getHabitsResponse = await client.send(
      new BatchGetItemCommand({
        RequestItems: {
          [`${DYNAMODB_TABLE_HABITS}`]: {
            Keys: habits.map((habit): { habit_id: { S: string }; habit_type: { S: string } } => ({
              habit_id: { S: habit.M?.habit_id.S! },
              habit_type: { S: habit.M?.habit_type.S! },
            })),
          },
        },
      })
    );

    if (getHabitsResponse.$metadata.httpStatusCode !== 200) return internalServerErrorResponse();
    const results = getHabitsResponse.Responses?.[`${DYNAMODB_TABLE_HABITS}`] || [];
    return okResponse(results);
  } catch (error) {
    console.error(error);
    return internalServerErrorResponse();
  }
}
