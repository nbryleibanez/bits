import { type NextRequest, NextResponse } from "next/server";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

import { habitSchema } from "@/lib/schema";
import { validateTokens } from "@/utils/auth/tokens";
import {
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const {
  DYNAMODB_TABLE_USERS,
  DYNAMODB_TABLE_HABITS,
  DYNAMODB_TABLE_HABIT_LOGS,
} = process.env;

export async function POST(request: NextRequest) {
  try {
    const payload = await validateTokens(request);
    if (!payload) return unauthorizedResponse();

    const { habitId, title, ownerId, ownerFullName, ownerAvatarUrl } =
      await request.json();

    const { data, success } = habitSchema.safeParse({
      habit_id: habitId,
      habit_type: "duo",
      owner: ownerId,
      title: title,
      streak: 0,
      created_date: new Date().toISOString(),
      participants: [
        {
          user_id: ownerId,
          role: "owner",
          is_logged: false,
        },
        {
          user_id: payload.access.sub,
          role: "participant",
          is_logged: false,
        },
      ],
    });

    if (!success) return internalServerErrorResponse();

    const getSourceUserResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.access.sub },
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

    const putItemCommandResponse = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Item: {
          habit_id: { S: data.habit_id },
          habit_type: { S: data.habit_type },
          owner: { S: data.owner },
          title: { S: data.title },
          streak: { N: data.streak.toString() },
          created_date: { S: data.created_date },
          participants: {
            L: data.participants.map((participant) => ({
              M: {
                user_id: { S: participant.user_id },
                role: { S: participant.role },
                is_logged: { BOOL: participant.is_logged },
              },
            })),
          },
        },
      }),
    );

    if (putItemCommandResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    const users = [payload.access.sub, ownerId];

    await Promise.all(
      users.map(async (userId) => {
        const isAcceptee = userId === payload.access.sub;
        const updateUsersResponse = await client.send(
          new UpdateItemCommand({
            TableName: DYNAMODB_TABLE_USERS,
            Key: {
              user_id: { S: userId },
            },
            UpdateExpression: isAcceptee
              ? `SET habits = list_append(habits, :habit) REMOVE habits_requests[${habitRequestIndex}]`
              : `SET habits = list_append(habits, :habit)`,
            ExpressionAttributeValues: {
              ":habit": {
                L: [
                  {
                    M: {
                      habit_id: { S: habitId },
                      habit_type: { S: "duo" },
                      title: { S: title },
                    },
                  },
                ],
              },
            },
          }),
        );

        if (updateUsersResponse.$metadata.httpStatusCode !== 200) {
          throw new Error(`Failed to update user ${userId}`);
        }
      }),
    );

    const timestamp = new Date().toISOString();
    const habitIdTimestamp = `${data.habit_id}_${timestamp}`;
    const createLogResponse = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABIT_LOGS,
        Item: {
          habit_id: { S: data.habit_id },
          timestamp: { S: timestamp.toString() },
          user_id: { S: ownerId },
          habit_id_timestamp: { S: habitIdTimestamp },
          title: { S: data.title },
          habit_type: { S: data.habit_type },
          action: { S: "create" },
        },
      }),
    );

    if (createLogResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    return NextResponse.json({ habitId }, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return internalServerErrorResponse();
  }
}
