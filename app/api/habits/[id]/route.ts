import { type NextRequest, NextResponse } from "next/server";
import {
  DynamoDBClient,
  GetItemCommand,
  DeleteItemCommand,
  PutItemCommand,
  UpdateItemCommand,
} from "@aws-sdk/client-dynamodb";
// import { CacheClient, CredentialProvider } from "@gomomento/sdk";

import { validateAccessToken } from "@/utils/auth/tokens";
import {
  okResponse,
  unauthorizedResponse,
  forbiddenResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const {
  DYNAMODB_TABLE_HABITS,
  DYNAMODB_TABLE_USERS,
  DYNAMODB_TABLE_HABIT_LOGS,
} = process.env;
const client = new DynamoDBClient({});
// const cacheClient = await CacheClient.create({
//   credentialProvider: CredentialProvider.fromEnvVar("MOMENTO_API_KEY"),
//   defaultTtlSeconds: 3600,
// });

/*
  Get Habit 
*/
export async function GET(
  req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const payload = await validateAccessToken(req);
    if (!payload) return unauthorizedResponse();

    // const getCache = await cacheClient.get(
    //   "staging-habits",
    //   `habit:${params.id}`,
    // );
    // if (getCache.type === "Hit")
    //   return okResponse(JSON.parse(getCache.valueString()));

    const type = req.nextUrl.searchParams.get("type") as string;
    const { $metadata, Item } = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          habit_type: { S: type },
        },
      }),
    );

    // await cacheClient.set(
    //   "staging-habits",
    //   `habit:${params.id}`,
    //   JSON.stringify(Item),
    // );

    if ($metadata.httpStatusCode !== 200 || !Item)
      return internalServerErrorResponse();
    return okResponse(Item);
  } catch (error) {
    console.error("Error in GET handler: ", error);
    return internalServerErrorResponse();
  }
}

/* 
  Update Habit
*/
export async function PATCH(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const habitType = request.nextUrl.searchParams.get("type") as string;
    const { action } = await request.json();

    const getItemCommandResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          habit_type: { S: habitType },
        },
      }),
    );

    if (
      getItemCommandResponse.$metadata.httpStatusCode !== 200 ||
      !getItemCommandResponse.Item
    ) {
      return internalServerErrorResponse();
    }

    const participants =
      getItemCommandResponse.Item.participants.L?.map(
        (
          p: any,
        ): {
          user_id: string;
          full_name: string;
          avatar_url: string;
          is_logged: boolean;
          role: string;
        } => ({
          user_id: p.M.user_id.S,
          full_name: p.M.full_name.S,
          avatar_url: p.M.avatar_url.S,
          is_logged: p.M.is_logged.BOOL,
          role: p.M.role.S,
        }),
      ) || [];

    const updatedParticipants = participants?.map((participant: any) =>
      participant.user_id === payload.sub
        ? { ...participant, is_logged: true }
        : participant,
    );

    const updatedParticipantsDynamoDB = updatedParticipants?.map((p: any) => ({
      M: {
        user_id: { S: p.user_id },
        full_name: { S: p.full_name },
        avatar_url: { S: p.avatar_url },
        is_logged: { BOOL: p.is_logged },
        role: { S: p.role },
      },
    }));

    const currentStreak = parseInt(getItemCommandResponse.Item.streak.N!);

    const isAllLogged = updatedParticipants?.every((p: any) => p.is_logged);
    let newStreak = currentStreak;

    if (action == "log") {
      newStreak = isAllLogged ? currentStreak + 1 : currentStreak;
    }

    const { $metadata } = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          habit_type: { S: habitType },
        },
        UpdateExpression: "SET streak = :streak, participants = :participants",
        ExpressionAttributeValues: {
          ":streak": { N: newStreak.toString() },
          ":participants": { L: updatedParticipantsDynamoDB },
        },
        ReturnValues: "NONE",
      }),
    );

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    const timestamp = new Date().toISOString();
    const habitIdTimestamp = `${params.id}_${timestamp}`;
    const createLogResponse = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABIT_LOGS,
        Item: {
          habit_id: { S: params.id },
          timestamp: { S: timestamp.toString() },
          user_id: { S: payload.sub },
          habit_id_timestamp: { S: habitIdTimestamp },
          title: { S: getItemCommandResponse.Item.title.S as string },
          habit_type: { S: getItemCommandResponse.Item.habit_type.S as string },
          action: { S: action },
        },
      }),
    );

    if (createLogResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    // await cacheClient.delete("staging-habits", `habit:${params.id}`);
    // await cacheClient.delete("staging-habits", `user:${payload.sub}:habits`);
    return NextResponse.json(
      { message: "Item updated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return internalServerErrorResponse();
  }
}

/*
  Delete Habit
*/
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { owner } = await request.json();
    const habitType = request.nextUrl.searchParams.get("type") as string;

    if (payload.sub !== owner) return forbiddenResponse();

    const { $metadata } = await client.send(
      new DeleteItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          habit_type: { S: habitType },
        },
      }),
    );

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    const getItemResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
        ProjectionExpression: "habits",
      }),
    );

    if (getItemResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    const habits = getItemResponse.Item?.habits.L;

    // Step 2: Find the index of the habit to remove
    const indexToRemove = habits?.findIndex(
      (habit) => habit.M?.habit_id.S === params.id,
    );

    if (indexToRemove === -1) {
      throw new Error("Habit not found");
    }

    const updateUserResponse = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: { user_id: { S: payload.sub } },
        UpdateExpression: `REMOVE habits[${indexToRemove}]`,
      }),
    );

    if (updateUserResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    const getHabitResponse = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          habit_id: { S: params.id },
          habit_type: { S: habitType },
        },
      }),
    );

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    const timestamp = new Date().toISOString();
    const habitIdTimestamp = `${params.id}_${timestamp}`;
    const createLogResponse = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABIT_LOGS,
        Item: {
          habit_id: { S: params.id },
          timestamp: { S: timestamp.toString() },
          user_id: { S: payload.sub },
          habit_id_timestamp: { S: habitIdTimestamp },
          title: { S: getHabitResponse.Item?.title.S as string },
          habit_type: { S: getHabitResponse.Item?.habit_type.S as string },
          action: { S: "delete" },
        },
      }),
    );

    if (createLogResponse.$metadata.httpStatusCode !== 200)
      return internalServerErrorResponse();

    // await cacheClient.delete("staging-habits", `habit:${params.id}`);
    // await cacheClient.delete("staging-habits", `user:${payload.sub}:habits`);
    return okResponse();
  } catch (error) {
    console.error("Error in DELETE handler: ", error);
    return internalServerErrorResponse();
  }
}
