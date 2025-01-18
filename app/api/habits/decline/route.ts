import { type NextRequest } from "next/server";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";

import { validateAccessToken } from "@/utils/auth/tokens";
import {
  okResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env;

export async function PATCH(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { habitId } = await request.json();

    const getSourceUserResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
        ProjectionExpression: "habits_requests",
      }),
    );

    if (
      getSourceUserResponse.$metadata.httpStatusCode != 200 ||
      !getSourceUserResponse.Item
    )
      return internalServerErrorResponse();

    const habitRequestIndex =
      getSourceUserResponse.Item.habits_requests.L?.findIndex(
        (h) => h.M?.habit_id.S === habitId,
      );

    const updateSourceUserResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
        UpdateExpression: `REMOVE habits_requests[${habitRequestIndex}]`,
      }),
    );

    if (updateSourceUserResponse.$metadata.httpStatusCode != 200)
      return internalServerErrorResponse();

    return okResponse();
  } catch (error) {
    console.error("Error in POST handler: ", error);
    return internalServerErrorResponse();
  }
}
