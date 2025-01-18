import { NextRequest } from "next/server";
import {
  DynamoDBClient,
  GetItemCommand,
  BatchGetItemCommand,
} from "@aws-sdk/client-dynamodb";
import { CacheClient, CredentialProvider } from "@gomomento/sdk";

import { validateAccessToken } from "@/utils/auth/tokens";
import {
  okResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const { DYNAMODB_TABLE_USERS, DYNAMODB_TABLE_HABITS } = process.env;
const client = new DynamoDBClient({});
const cacheClient = await CacheClient.create({
  credentialProvider: CredentialProvider.fromEnvVar("MOMENTO_API_KEY"),
  defaultTtlSeconds: 3600,
});

/*
  Get all habits for the authenticated user
*/
export async function GET(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const id = request.nextUrl.searchParams.get("id") as string;
    const user_id = id ? id : payload.sub;

    const getCache = await cacheClient.get(
      "staging-habits",
      `user:${user_id}:habits`,
    );
    if (getCache.type === "Hit")
      return okResponse(JSON.parse(getCache.valueString()));

    const getUserResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: user_id },
        },
        ProjectionExpression: "habits",
      }),
    );

    if (
      getUserResponse.$metadata.httpStatusCode !== 200 ||
      !getUserResponse.Item
    )
      return internalServerErrorResponse();

    const habits = getUserResponse.Item.habits.L || [];

    const uniqueKeys = new Set(
      habits.map((habit) => `${habit.M?.habit_id.S}#${habit.M?.habit_type.S}`),
    );

    const keysArray = Array.from(uniqueKeys).map((key) => {
      const [habit_id, habit_type] = key.split("#");
      return {
        habit_id: { S: habit_id },
        habit_type: { S: habit_type },
      };
    });

    if (keysArray.length === 0) {
      return okResponse([]); // Return an empty array if there are no habits
    }

    const getHabitsResponse = await client.send(
      new BatchGetItemCommand({
        RequestItems: {
          [`${DYNAMODB_TABLE_HABITS}`]: {
            Keys: keysArray,
          },
        },
      }),
    );

    if (getHabitsResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    const results =
      getHabitsResponse.Responses?.[`${DYNAMODB_TABLE_HABITS}`] || [];

    await cacheClient.set(
      "staging-habits",
      `user:${user_id}:habits`,
      JSON.stringify(results),
    );
    return okResponse(results);
  } catch (error) {
    console.error(error);
    return internalServerErrorResponse();
  }
}
