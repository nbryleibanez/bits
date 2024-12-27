import { type NextRequest, NextResponse } from "next/server";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";

// Utils
import { validateAccessToken } from "@/utils/auth/tokens";
import {
  unauthorizedResponse,
  internalServerErrorResponse,
  badRequestResponse,
  okResponse,
} from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS } = process.env;

export async function GET(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const { $metadata, Item } = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
      }),
    );

    if ($metadata.httpStatusCode !== 200 || !Item)
      return internalServerErrorResponse();
    return NextResponse.json({ data: Item }, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler: ", error);
    return internalServerErrorResponse();
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const body = await request.json();

    const validAttributes = ["username", "full_name", "age", "sex"];
    const updateAttributes = Object.keys(body).filter(
      (key) => validAttributes.includes(key) && body[key] !== undefined,
    );

    if (updateAttributes.length === 0) {
      return badRequestResponse("No valid attributes provided for update");
    }

    // If username is being updated, check for uniqueness
    if (body.username) {
      // First get the current user to check if the username is actually changing
      const { Item: currentUser } = await client.send(
        new GetItemCommand({
          TableName: DYNAMODB_TABLE_USERS,
          Key: {
            user_id: { S: payload.sub },
          },
        }),
      );

      // Only check for conflicts if the username is actually different
      if (!currentUser || currentUser.username.S !== body.username) {
        const usernameExists = await checkUsernameExists(body.username);
        if (usernameExists) {
          return badRequestResponse("Username already exists");
        }
      }
    }

    // Build dynamic update expression and attribute values
    const updateExpressions: string[] = [];
    const expressionAttributeValues: Record<string, any> = {};

    updateAttributes.forEach((attr) => {
      const placeholder = `:${attr}`;
      updateExpressions.push(`${attr} = ${placeholder}`);

      // Handle different attribute types
      if (attr === "age") {
        expressionAttributeValues[placeholder] = { N: body[attr].toString() };
      } else {
        expressionAttributeValues[placeholder] = { S: body[attr] };
      }
    });

    const { $metadata } = await client.send(
      new UpdateItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
        },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "NONE",
      }),
    );

    if ($metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    return okResponse();
  } catch (error) {
    console.error("Error in PATCH handler: ", error);
    return internalServerErrorResponse();
  }
}

async function checkUsernameExists(username: string): Promise<boolean> {
  try {
    const { Items } = await client.send(
      new QueryCommand({
        TableName: DYNAMODB_TABLE_USERS,
        IndexName: "username-index",
        KeyConditionExpression: "username = :username",
        ExpressionAttributeValues: {
          ":username": { S: username },
        },
        Limit: 1,
      }),
    );

    return Items !== undefined && Items.length > 0;
  } catch (error) {
    console.error("Error checking username existence:", error);
    throw error;
  }
}
