
import { type NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand, QueryCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { verifyToken } from "@/utils/verify-token";
import { validateRequest } from "@/helpers/auth/validate-request";

import {
  okResponse,
  badRequestResponse,
  unauthorizedResponse,
  notFoundResponse,
  conflictResponse,
  internalServerErrorResponse
} from "@/helpers/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env

export async function POST(request: NextRequest) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

    const body = await request.json();
    const idToken = request.cookies.get('id_token')?.value as string;
    const idTokenPayload = await verifyToken(idToken, "id")
    if (!idTokenPayload) return unauthorizedResponse();

    if (body.username === idTokenPayload['custom:username']) {
      return badRequestResponse("You cannot send a friend request to yourself.")
    }

    const getSenderResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: payload.sub } },
      })
    )
    if (getSenderResponse.$metadata.httpStatusCode !== 200 || !getSenderResponse.Item) return internalServerErrorResponse();

    const isFriend = getSenderResponse.Item?.friends?.L?.some((f) =>
      f.M?.username?.S === body.username
    );
    if (isFriend) return conflictResponse("You are already friends with this user.");

    // Check if user exists
    const checkTargetExistsResponse = await client.send(
      new QueryCommand({
        TableName: DYNAMODB_TABLE_USERS,
        IndexName: "username-index",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
          ":username": { S: body.username },
        },
      })
    )

    if (checkTargetExistsResponse.$metadata.httpStatusCode !== 200 || !checkTargetExistsResponse.Items) return internalServerErrorResponse();
    if (checkTargetExistsResponse.Count === 0) return notFoundResponse();

    const hasPendingRequest = checkTargetExistsResponse.Items[0].friend_requests.L?.some((r) =>
      r.M?.user_id.S === payload.sub
    );
    if (hasPendingRequest) return conflictResponse("You have already sent a friend request to this user.");

    // Add friend request
    const addFriendRequestResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: checkTargetExistsResponse.Items[0].user_id.S as string },
          username: { S: body.username },
        },
        UpdateExpression: "SET friend_requests = list_append(friend_requests, :newFriendRequest)",
        ExpressionAttributeValues: {
          ":newFriendRequest": {
            L: [
              {
                M: {
                  user_id: { S: payload.sub },
                  username: { S: getSenderResponse.Item.username.S as string },
                  full_name: { S: getSenderResponse.Item.full_name.S as string },
                  avatar_url: { S: getSenderResponse.Item.avatar_url.S as string },
                  created_date: { S: new Date().toISOString() },
                },
              },
            ],
          },
        },
        ReturnValues: "NONE",
      })
    )

    if (addFriendRequestResponse.$metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    return okResponse();
  } catch (error) {
    console.error("Error in POST handler: ", error);
    return internalServerErrorResponse();
  }
}
