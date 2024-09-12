import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"
import verifyToken from "@/utils/verify-token"

const client = new DynamoDBClient({})

const { DYNAMODB_TABLE_USERS } = process.env;

export async function GET(request: NextRequest) {
  const cookieStore = cookies()
  const idToken = cookieStore.get("id_token")?.value as string

  try {
    const { payload, error } = await verifyToken(idToken, "id")

    if (error) return NextResponse.json({ error }, { status: 500 })

    const command = new GetItemCommand({
      TableName: DYNAMODB_TABLE_USERS,
      Key: {
        userId: { S: payload!.sub },
        username: { S: "nbryleibanez" }
      }
    })

    const { Item } = await client.send(command)

    return NextResponse.json({ Item }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error }, { status: 500 })
  }
}
