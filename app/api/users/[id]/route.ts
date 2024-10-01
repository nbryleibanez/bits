import { type NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

import { validateAccessToken } from "@/utils/auth/tokens";
import { unauthorizedResponse, internalServerErrorResponse } from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env;

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { $metadata, Item } = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: params.id },
        },
      })
    );

    if ($metadata.httpStatusCode !== 200 || !Item) return internalServerErrorResponse();

    return NextResponse.json({ Item }, { status: 200 })
  } catch (error: any) {
    console.error("Error in GET handler: ", error);
    return internalServerErrorResponse();
  }
}
