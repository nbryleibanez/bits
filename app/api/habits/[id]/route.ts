import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import verifyToken from "@/utils/verify-token";
import { DynamoDBClient, GetItemCommand, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_HABITS } = process.env;

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();
  const { id } = params

  try {

    const accessToken = cookieStore.get("access_token")?.value as string;
    const { payload, error } = await verifyToken(accessToken, "access");

    if (error) return NextResponse.json({ error }, { status: 401 })

    const res = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          userId: { S: payload?.sub as string },
          habitId: { S: id },
        },
      })
    )

    if (res.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }

    return NextResponse.json({ habit: res.Item }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  const cookieStore = cookies();

  try {
    const body = await req.json()
    const accessToken = cookieStore.get("access_token")?.value as string;
    const { payload, error } = await verifyToken(accessToken, "access");

    if (error) return NextResponse.json({ error }, { status: 401 })

    const res = await client.send(
      new DeleteItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Key: {
          userId: { S: payload?.sub as string },
          habitId: { S: body.id as string }
        },
      })
    )

    if (res.$metadata.httpStatusCode !== 200) {
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
    }

    return NextResponse.json({ message: "Item deleted successfuly." }, { status: 200 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
