import { type NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import {
  DynamoDBClient,
  GetItemCommand,
  DeleteItemCommand,
  UpdateItemCommand
} from "@aws-sdk/client-dynamodb";

import { validateAccessToken } from "@/utils/auth/tokens";
import {
  okResponse,
  unauthorizedResponse,
  forbiddenResponse,
  internalServerErrorResponse
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_HABITS } = process.env;

/*
  Get habit 
*/
export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const payload = await validateAccessToken(req);
    if (!payload) return unauthorizedResponse();

    const type = req.nextUrl.searchParams.get('type') as string;
    const { $metadata, Item } = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          habit_type: { S: type }
        },
      })
    )

    if ($metadata.httpStatusCode !== 200 || !Item) return internalServerErrorResponse();
    return okResponse(Item);
  } catch (error) {
    console.error('Error in GET handler: ', error)
    return internalServerErrorResponse();
  }
}

/* 
  Update Habit
*/
export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const habitType = request.nextUrl.searchParams.get('type') as string;

    const getItemCommandResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          habit_type: { S: habitType },
        },
      })
    );

    if (getItemCommandResponse.$metadata.httpStatusCode !== 200 || !getItemCommandResponse.Item) {
      return internalServerErrorResponse();
    }

    const participants = getItemCommandResponse.Item.participants.L?.map((p: any) => ({
      user_id: p.M.user_id.S,
      full_name: p.M.full_name.S,
      avatar_url: p.M.avatar_url.S,
      is_logged: p.M.is_logged.BOOL,
      role: p.M.role.S
    })) || [];

    const updatedParticipants = participants?.map((participant: any) =>
      participant.user_id === payload.sub ? { ...participant, is_logged: true } : participant
    );

    const updatedParticipantsDynamoDB = updatedParticipants?.map((p: any) => ({
      M: {
        user_id: { S: p.user_id },
        full_name: { S: p.full_name },
        avatar_url: { S: p.avatar_url },
        is_logged: { BOOL: p.is_logged },
        role: { S: p.role }
      }
    }));

    const currentStreak = parseInt(getItemCommandResponse.Item.streak.N!);

    const isAllLogged = updatedParticipants?.every((p: any) => p.is_logged);
    const newStreak = isAllLogged ? currentStreak + 1 : currentStreak;

    const { $metadata } = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          habit_type: { S: habitType }
        },
        UpdateExpression: "SET streak = :streak, participants = :participants",
        ExpressionAttributeValues: {
          ":streak": { N: newStreak.toString() },
          ":participants": { L: updatedParticipantsDynamoDB }
        },
        ReturnValues: "NONE",
      })
    );

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    revalidateTag(`habit/${params.id}`)

    return NextResponse.json({ message: "Item updated successfully." }, { status: 200 });
  } catch (error) {
    console.error('Error in PATCH handler:', error);
    return internalServerErrorResponse();
  }
}

/*
  Delete Habit
*/
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { owner } = await request.json();
    const habitType = request.nextUrl.searchParams.get('type') as string;

    if (payload.sub !== owner) return forbiddenResponse();

    const { $metadata } = await client.send(
      new DeleteItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          habit_type: { S: habitType },
        },
      })
    )

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    revalidateTag('habits')
    revalidateTag(`habit/${params.id}`)

    return okResponse();
  } catch (error) {
    console.error('Error in DELETE handler: ', error)
    return internalServerErrorResponse();
  }
}
