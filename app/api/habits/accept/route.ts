import { type NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";

import { verifyToken } from "@/utils/auth/tokens";
import { validateAccessToken } from "@/utils/auth/tokens";
import { unauthorizedResponse, internalServerErrorResponse } from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS, DYNAMODB_TABLE_HABITS } = process.env

export async function PATCH(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { habitId } = await request.json();
    const idToken = request.cookies.get('id_token')?.value as string
    const idTokenPayload = await verifyToken(idToken, "id")

    console.log('check1')

    const updateHabitResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: habitId },
          status: { S: 'pending' }
        },
        UpdateExpression:
          "SET participants = list_append(participants, :participant), #status = :habitStatus, created_date = :created_date",
        ExpressionAttributeNames: { "#status": "status" },
        ExpressionAttributeValues: {
          ":created_date": { S: new Date().toISOString() },
          ":habitStatus": { S: "active" },
          ":participant": {
            L: [
              {
                M: {
                  user_id: { S: payload.sub },
                  full_name: { S: idTokenPayload?.name as string },
                  avatar_url: { S: idTokenPayload?.picture as string },
                  role: { S: 'participant' },
                  is_logged: { BOOL: false }
                }
              }
            ]
          }
        }
      })
    )

    if (updateHabitResponse.$metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    const updateParticipantResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: payload.sub } },
        UpdateExpression: "ADD habits :habit_id",
        ExpressionAttributeValues: {
          ":habit_id": { SS: [`${habitId}`] }
        }
      })
    )
    if (updateParticipantResponse.$metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    console.log('check3')
    return NextResponse.json({ habitId }, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH handler: ", error)
    return internalServerErrorResponse();
  }
}
