import { type NextRequest } from "next/server";
import {
  DynamoDBClient,
  GetItemCommand,
} from "@aws-sdk/client-dynamodb";

import { validateAccessToken } from "@/utils/auth/tokens";
import { okResponse, internalServerErrorResponse, unauthorizedResponse } from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env;

export async function GET(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request)
    if (!payload) return unauthorizedResponse()

    const { $metadata, Item } = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub as string },
        },
        ProjectionExpression: "habits_requests"
      })
    )

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse()

    return okResponse(Item?.habits_requests.L)
  } catch (error) {
    console.error("Error in GET handler: ", error)
    return internalServerErrorResponse();
  }
}
