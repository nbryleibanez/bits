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

export async function POST(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { sourceUserId, targetUserId } = await request.json();

    const getSourceUserResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: sourceUserId } },
      }),
    );

    if (getSourceUserResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    const sourceFriends = getSourceUserResponse.Item?.friends.L;

    const sourceIndex = sourceFriends?.findIndex(
      (f) => f.M?.user_id.S === targetUserId,
    );

    if (sourceIndex === -1) throw new Error("Friend not found");

    // Update Source User
    const updateSourceUserResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: payload.sub } },
        UpdateExpression: `REMOVE friends[${sourceIndex}]`,
      }),
    );

    if (updateSourceUserResponse.$metadata.httpStatusCode != 200)
      return internalServerErrorResponse();

    const getTargetUserResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: targetUserId } },
      }),
    );

    if (getTargetUserResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    const targetFriends = getTargetUserResponse.Item?.friends.L;

    const targetIndex = targetFriends?.findIndex(
      (f) => f.M?.user_id.S === sourceUserId,
    );

    if (targetIndex === -1) throw new Error("Friend not found");

    const updateTargetUserResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: targetUserId } },
        UpdateExpression: `REMOVE friends[${targetIndex}]`,
      }),
    );

    if (updateTargetUserResponse.$metadata.httpStatusCode != 200)
      return internalServerErrorResponse();
    return okResponse();
  } catch (error) {
    console.error("Error in POST handler: ", error);
    return internalServerErrorResponse();
  }
}
