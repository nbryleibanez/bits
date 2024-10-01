import { type NextRequest } from "next/server";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

import { validateAccessToken } from "@/utils/auth/tokens";
import {
  okResponse,
  unauthorizedResponse,
  internalServerErrorResponse
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env

export async function POST(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const body = await request.json();

    const updateSourceUserResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
        UpdateExpression: `REMOVE friend_requests[${body.index}]`,
      })
    )

    if (updateSourceUserResponse.$metadata.httpStatusCode != 200) return internalServerErrorResponse();
    return okResponse();
  } catch (error) {
    console.error("Error in POST handler: ", error);
    return internalServerErrorResponse();
  }
}
