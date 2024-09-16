import { type NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand, DeleteItemCommand, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { validateRequest } from "@/helpers/auth/validate-request";
import { unauthorizedResponse, internalServerErrorResponse } from "@/helpers/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_HABITS } = process.env;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await validateRequest(req);
    if (!payload) return unauthorizedResponse();

    const { $metadata, Item } = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          user_id: { S: payload.sub },
        },
      })
    )

    if ($metadata.httpStatusCode !== 200 || !Item) return internalServerErrorResponse();

    return NextResponse.json({ Item }, { status: 200 })
  } catch (error) {
    console.error('Error in GET handler: ', error)
    return internalServerErrorResponse();
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

    const { $metadata } = await client.send(
      new DeleteItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          user_id: { S: payload?.sub as string },
          habit_id: { S: params.id }
        },
      })
    )

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    return NextResponse.json({ message: "Item deleted successfully." }, { status: 200 })
  } catch (error) {
    console.error('Error in DELETE handler: ', error)
    return internalServerErrorResponse();
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

    const user_id = payload.sub;
    const { isLogged, streak } = await request.json()

    const getItemCommandResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          user_id: { S: user_id }
        },
      })
    )

    if (getItemCommandResponse.$metadata.httpStatusCode !== 200 || !getItemCommandResponse.Item) return internalServerErrorResponse();

    const participants = getItemCommandResponse.Item.participants.L?.map((p: any) => ({
      user_id: p.M.user_id.S,
      full_name: p.M.full_name.S,
      avatar_url: p.M.avatar_url.S,
      is_logged: p.M.is_logged.BOOL,
      role: p.M.role.S
    }))

    const updatedParticipants = participants?.map((participant: any) =>
      participant.user_id === payload.sub ? { ...participant, is_logged: true } : participant
    )

    const updatedParticipantsDynamoDB = updatedParticipants?.map((p: any) => ({
      M: {
        user_id: { S: p.user_id },
        full_name: { S: p.full_name },
        avatar_url: { S: p.avatar_url },
        is_logged: { BOOL: p.is_logged },
        role: { S: p.role }
      }
    }))

    const isAllLogged = updatedParticipants?.every((p: any) => p.is_logged)
    const newStreak = isAllLogged ? streak + 1 : streak

    const { $metadata } = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          user_id: { S: payload?.sub as string },
          habit_id: { S: params.id }
        },
        UpdateExpression: "SET streak = :streak, participants = :participants",
        ExpressionAttributeValues: {
          ":streak": { N: newStreak.toString() },
          ":participants": { L: updatedParticipantsDynamoDB }

        },
        ReturnValues: "NONE",
      })
    )

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    return NextResponse.json({ message: "Item updated successfuly." }, { status: 200 })
  } catch (error) {
    console.error('Error in PATCH handler: ', error)
    return internalServerErrorResponse();
  }
}
