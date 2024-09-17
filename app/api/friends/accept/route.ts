import { type NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { validateRequest } from "@/helpers/auth/validate-request";

import {
  okResponse,
  badRequestResponse,
  unauthorizedResponse,
  internalServerErrorResponse
} from "@/helpers/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env

export async function POST(request: NextRequest) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

    const body = await request.json();

    // Update Source User
    const updateSourceUserResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
        UpdateExpression: `
          SET friends = list_append(friends, :friend)1
          REMOVE friend_requests[${body.index}] 
        `,
        ExpressionAttributeValues: {
          ":friend": {
            L: [
              {
                M: {
                  user_id: { S: "user_id" },
                  username: { S: "username" },
                  full_name: { S: "full_name" },
                  avatar_url: { S: "avatar_url" },
                  created_at: { S: new Date().toISOString() },
                },
              },
            ],
          },
        },
      })
    )

    if (updateSourceUserResponse.$metadata.httpStatusCode != 200) return internalServerErrorResponse();

    const updateTargetUserResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
        UpdateExpression: "SET friends = list_append(friends, :friend)",
        ExpressionAttributeValues: {
          ":friend": {
            L: [
              {
                M: {
                  user_id: { S: "user_id" },
                  username: { S: "username" },
                  full_name: { S: "full_name" },
                  avatar_url: { S: "avatar_url" },
                  created_at: { S: new Date().toISOString() },
                },
              },
            ],
          },
        },
      })
    )

    if (updateTargetUserResponse.$metadata.httpStatusCode != 200) return internalServerErrorResponse();

    return okResponse();
  } catch (error) {
    console.error("Error in POST handler: ", error);
    return internalServerErrorResponse();
  }
}
