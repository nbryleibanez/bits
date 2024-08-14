import { type NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({ region: "ap-southeast-1" });

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const command = new GetItemCommand({
      TableName: process.env.TABLE_USERS,
      Key: {
        userId: { S: params.id },
      },
    });

    const data = await client.send(command);

    console.log(data);

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message });
  }
}
