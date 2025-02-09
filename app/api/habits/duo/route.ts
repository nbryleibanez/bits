import { type NextRequest, NextResponse } from "next/server";
import { ulid } from "ulid";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

import { habitSchema } from "@/lib/schema";
import { verifyToken, validateAccessToken } from "@/utils/auth/tokens";
import {
  badRequestResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_HABITS, DYNAMODB_TABLE_USERS } = process.env;

export async function POST(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { title, duoId, type } = await request.json();
    const habitId = ulid();
    const dateNow = new Date().toISOString();

    if (!type || !title) return badRequestResponse("Missing required fields");

    const idToken = request.cookies.get("id_token")?.value as string;
    const idTokenPayload = await verifyToken(idToken, "id");

    const getDuoResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: duoId } },
      }),
    );

    if (getDuoResponse.$metadata.httpStatusCode != 200 || !getDuoResponse.Item)
      return internalServerErrorResponse();

    const { data, success } = habitSchema.safeParse({
      habit_id: habitId,
      habit_type: type,
      title: title,
      streak: 0,
      created_date: dateNow,
      participants: [
        {
          user_id: payload.sub,
          username: idTokenPayload?.["custom:username"] as string,
          full_name: idTokenPayload?.name as string,
          avatar_url: idTokenPayload?.picture as string,
          role: "owner",
          is_logged: false,
        },
        {
          user_id: getDuoResponse.Item.user_id.S,
          username: getDuoResponse.Item.username.S,
          full_name: getDuoResponse.Item.full_name.S,
          avatar_url: getDuoResponse.Item.avatar_url.S,
          role: "participant",
          is_logged: false,
        },
      ],
    });

    if (!success) return badRequestResponse();

    const { $metadata } = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Item: {
          habit_id: { S: data.habit_id },
          type: { S: data.habit_type },
          title: { S: data.title },
          streak: { N: data.streak.toString() },
          created_date: { S: data.created_date },
          participants: {
            L: data.participants.map((participant) => ({
              M: {
                user_id: { S: participant.user_id },
                full_name: { S: participant.full_name },
                avatar_url: { S: participant.avatar_url },
                role: { S: participant.role },
                is_logged: { BOOL: participant.is_logged },
              },
            })),
          },
        },
      }),
    );

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    return NextResponse.json({ habitId }, { status: 201 });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return internalServerErrorResponse();
  }
}
