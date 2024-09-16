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
          userId: { S: payload?.sub as string },
          habitId: { S: params.id }
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

    const { isLogged, streak } = await request.json()

    const { $metadata } = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          userId: { S: payload?.sub as string },
          habitId: { S: params.id }
        },
        UpdateExpression: "SET streak = :streak, isLogged = :isLogged",
        ExpressionAttributeValues: {
          ":streak": { N: streak + 1 },
          ":isLogged": { BOOL: !isLogged },
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
