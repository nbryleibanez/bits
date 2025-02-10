import { type NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

import { validateAccessToken } from "@/utils/auth/tokens";
import {
  okResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const { DYNAMODB_TABLE_USERS } = process.env;
const client = new DynamoDBClient({});

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { $metadata, Item } = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: params.id },
        },
      }),
    );

    if ($metadata.httpStatusCode !== 200 || !Item)
      return internalServerErrorResponse();

    return okResponse(Item);
  } catch (error: any) {
    console.error("Error in GET handler: ", error);
    return internalServerErrorResponse();
  }
}
