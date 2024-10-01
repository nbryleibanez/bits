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

    const {
      sourceUserId,
      sourceUsername,
      sourceFullName,
      sourceAvatarUrl,
      targetUserId,
      targetUsername,
      targetFullName,
      targetAvatarUrl,
      index,
    } = await request.json();
    const date = new Date().toISOString()

    // Update Source User
    const updateSourceUserResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
        UpdateExpression: `
          SET friends = list_append(friends, :friend) 
          REMOVE friend_requests[${index}] 
        `,
        ExpressionAttributeValues: {
          ":friend": {
            L: [
              {
                M: {
                  user_id: { S: targetUserId },
                  username: { S: targetUsername },
                  full_name: { S: targetFullName },
                  avatar_url: { S: targetAvatarUrl },
                  created_at: { S: date },
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
          user_id: { S: targetUserId },
        },
        UpdateExpression: "SET friends = list_append(friends, :friend)",
        ExpressionAttributeValues: {
          ":friend": {
            L: [
              {
                M: {
                  user_id: { S: sourceUserId },
                  username: { S: sourceUsername },
                  full_name: { S: sourceFullName },
                  avatar_url: { S: sourceAvatarUrl },
                  created_at: { S: date },
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
