import { type NextRequest } from "next/server";
import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";

import { validateAccessToken } from "@/utils/auth/tokens";
import {
  okResponse,
  unauthorizedResponse,
  notFoundResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env;

export async function GET(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const username = request.nextUrl.searchParams.get("q") as string;

    const searchUsernameResponse = await client.send(
      new QueryCommand({
        TableName: DYNAMODB_TABLE_USERS,
        IndexName: "username-index",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
          ":username": { S: username },
        },
        Limit: 1,
      }),
    );

    if (searchUsernameResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    if (searchUsernameResponse.Count === 0) return notFoundResponse();

    return okResponse(searchUsernameResponse.Items?.[0]);
  } catch (error) {
    console.error("Error in GET handler: ", error);
    return internalServerErrorResponse();
  }
}
