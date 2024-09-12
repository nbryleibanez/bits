import { type NextRequest, NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import { ulid } from "ulid"
import verifyToken from "@/utils/verify-token"
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_HABITS } = process.env;

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  try {
    const body = await request.json()
    const habitId = ulid()
    const idToken = cookieStore.get("id_token")?.value as string;
    const { payload, error } = await verifyToken(idToken, "id");
    const dateNow = new Date().toISOString()

    const response = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Item: {
          userId: { S: payload?.sub as string },
          habitId: { S: habitId as string },
          type: { S: body.type as string },
          title: { S: body.title as string },
          streak: { N: "0" },
          createdDate: { S: dateNow as string },
        },
      })
    )

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
