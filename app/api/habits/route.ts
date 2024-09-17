import { type NextRequest, NextResponse } from "next/server"
import { ulid } from "ulid"

import { habitSchema } from "@/lib/schema"
import { verifyToken } from "@/utils/verify-token"
import { validateRequest } from "@/helpers/auth/validate-request"
import { badRequestResponse, unauthorizedResponse, internalServerErrorResponse } from "@/helpers/http/responses"
import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_HABITS } = process.env;

export async function GET(request: NextRequest) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

    const { $metadata, Items } = await client.send(
      new QueryCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        IndexName: "user-habit-index",
        KeyConditionExpression: "user_id = :user_id",
        ExpressionAttributeValues: {
          ":user_id": { S: payload?.sub as string },
        },
      })
    )

    if ($metadata.httpStatusCode !== 200 || !Items) {
      return internalServerErrorResponse();
    }

    return NextResponse.json({ Items }, { status: 200 })
  } catch (error) {
    console.error('Error in GET handler:', error)
    return internalServerErrorResponse();
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

    const body = await request.json()
    const habitId = ulid()
    const dateNow = new Date().toISOString()

    if (!body.type || !body.title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const idToken = request.cookies.get("id_token")?.value as string;
    const idTokenPayload = await verifyToken(idToken, "id");

    const parsed = habitSchema.safeParse({
      user_id: payload.sub,
      habit_id: habitId,
      type: body.type,
      title: body.title,
      streak: 0,
      created_date: dateNow,
      participants: [{
        user_id: payload.sub,
        username: idTokenPayload?.["custom:username"] as string,
        full_name: idTokenPayload?.name as string,
        avatar_url: idTokenPayload?.picture as string,
        role: 'owner',
        is_logged: false,
      }],
    })


    if (!parsed.success) return badRequestResponse();
    console.log(parsed)

    const { $metadata } = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Item: {
          habit_id: { S: parsed.data.habit_id },
          user_id: { S: parsed.data.user_id },
          type: { S: parsed.data.type },
          title: { S: parsed.data.title },
          streak: { N: parsed.data.streak.toString() },
          created_date: { S: parsed.data.created_date },
          participants: {
            L: parsed.data.participants.map(participant => ({
              M: {
                user_id: { S: participant.user_id },
                full_name: { S: participant.full_name },
                avatar_url: { S: participant.avatar_url },
                role: { S: participant.role },
                is_logged: { BOOL: participant.is_logged },
              }
            })),
          },
        },
      })
    )

    console.log("3")
    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();
    return NextResponse.json({ habitId }, { status: 201 })
  } catch (error) {
    console.error('Error in POST handler:', error)
    return internalServerErrorResponse();
  }
}
