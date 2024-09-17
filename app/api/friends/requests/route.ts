import { type NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { validateRequest } from "@/helpers/auth/validate-request";

import { unauthorizedResponse, internalServerErrorResponse } from "@/helpers/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env;

export async function GET(request: NextRequest) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

    const { $metadata, Item } = await client.send(
      new GetItemCommand({
        TableName: ,
        Key: {
          user_id: { S: payload.sub },
        },
      })
    )

  } catch (error) {
    console.error('Error in GET handler: ', error)
    return internalServerErrorResponse();
  }
}
