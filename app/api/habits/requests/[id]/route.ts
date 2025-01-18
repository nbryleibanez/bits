import { type NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb";

import { validateAccessToken } from "@/utils/auth/tokens";
import {
  okResponse,
  unauthorizedResponse,
  internalServerErrorResponse,
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env;

/*
  Get Habit Request 
*/
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  const params = await props.params;

  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const id = request.nextUrl.searchParams.get("id") as string;
    const user_id = id ? id : payload.sub;

    const { $metadata, Item } = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: user_id },
        },
        ProjectionExpression: "habits_requests",
      }),
    );

    if ($metadata.httpStatusCode !== 200 || !Item)
      return internalServerErrorResponse();

    const habitRequest = Item.habits_requests.L?.filter(
      (h) => h.M?.habit_id.S === params.id,
    );

    return okResponse(habitRequest?.[0].M);
  } catch (error) {
    console.error("Error in GET handler: ", error);
    return internalServerErrorResponse();
  }
}
