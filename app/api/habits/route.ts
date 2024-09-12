import { type NextRequest, NextResponse } from "next/server"
import { cookies, headers } from "next/headers"
import { ulid } from "ulid"
import verifyToken from "@/utils/verify-token"
import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_HABITS } = process.env;

export async function GET(request: NextRequest) {
  const cookieStore = cookies();

  try {
    const idToken = cookieStore.get("id_token")?.value as string;
    const { payload, error } = await verifyToken(idToken, "id");
    if (error) return NextResponse.json({ error }, { status: 401 })

    const res = await client.send(
      new QueryCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        KeyConditionExpression: "userId = :userId",
        ExpressionAttributeValues: {
          ":userId": { S: payload?.sub as string },
        },
      })
    )

    if (res.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }

    return NextResponse.json({ habits: res.Items }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  try {
    const body = await request.json()
    const habitId = ulid()
    const idToken = cookieStore.get("id_token")?.value as string;
    const dateNow = new Date().toISOString()
    const { payload, error } = await verifyToken(idToken, "id");

    if (error) return NextResponse.json({ error }, { status: 401 })

    const res = await client.send(
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

    if (res.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }

    return NextResponse.json({ habitId, message: "Habit created successfully" }, { status: 200 })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
