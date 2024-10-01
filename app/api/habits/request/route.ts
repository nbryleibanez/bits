import { type NextRequest } from "next/server";
import {
  DynamoDBClient,
  PutItemCommand,
  UpdateItemCommand
} from "@aws-sdk/client-dynamodb";
import { ulid } from "ulid";

import { habitSchema } from "@/lib/schema";
import { verifyToken, validateAccessToken } from "@/utils/auth/tokens";
import {
  okResponse,
  badRequestResponse,
  unauthorizedResponse,
  internalServerErrorResponse
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS, DYNAMODB_TABLE_HABITS } = process.env

export async function POST(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const habitId = ulid();
    const { title, duoId, type } = await request.json();
    const idToken = request.cookies.get('id_token')?.value as string;
    const idTokenPayload = await verifyToken(idToken, "id");

    const { data, success } = habitSchema.safeParse({
      habit_id: habitId,
      status: 'pending',
      owner: payload.sub,
      type: type,
      title: title,
      streak: 0,
      created_date: new Date().toISOString(),
      participants: [{
        user_id: payload.sub,
        full_name: idTokenPayload?.name,
        avatar_url: idTokenPayload?.picture,
        role: 'owner',
        is_logged: false,
      }],
    })

    if (!success) return badRequestResponse();

    const updateTargetResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: duoId } },
        UpdateExpression: "ADD habits_requests :habit_id",
        ExpressionAttributeValues: {
          ":habit_id": { SS: [`${habitId}`] },
        },
      })
    )

    if (updateTargetResponse.$metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    const updateOwnerResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: duoId } },
        UpdateExpression: "ADD habits :habit_id",
        ExpressionAttributeValues: {
          ":habit_id": { SS: [`${habitId}`] },
        },
      })
    )
    if (updateOwnerResponse.$metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    const putItemCommandResponse = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Item: {
          habit_id: { S: data.habit_id },
          type: { S: data.type },
          owner: { S: data.owner },
          title: { S: data.title },
          streak: { N: data.streak.toString() },
          created_date: { S: data.created_date },
          participants: {
            L: data.participants.map(participant => ({
              M: {
                user_id: { S: participant.user_id },
                full_name: { S: participant.full_name },
                avatar_url: { S: participant.avatar_url },
                role: { S: participant.role },
                is_logged: { BOOL: participant.is_logged },
              }
            })),
          },
        }
      })
    )
    if (putItemCommandResponse.$metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    return okResponse();
  } catch (error) {
    console.error("Error in POST handler: ", error);
    return internalServerErrorResponse();
  }
}
