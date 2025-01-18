import { type NextRequest, NextResponse } from "next/server";
import {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
  QueryCommand,
} from "@aws-sdk/client-dynamodb";
import { CacheClient, CredentialProvider } from "@gomomento/sdk";

import { validateAccessToken } from "@/utils/auth/tokens";
import {
  unauthorizedResponse,
  internalServerErrorResponse,
  badRequestResponse,
  okResponse,
} from "@/utils/http/responses";

const { DYNAMODB_TABLE_USERS } = process.env;
const client = new DynamoDBClient({});
const cacheClient = await CacheClient.create({
  credentialProvider: CredentialProvider.fromEnvVar("MOMENTO_API_KEY"),
  defaultTtlSeconds: 600,
});

export async function GET(request: NextRequest) {
  try {
    const payload = await validateAccessToken(request);
    if (!payload) return unauthorizedResponse();

    const cacheKey = `user:${payload.sub}`;
    const getCache = await cacheClient.get("staging-habits", cacheKey);
    if (getCache.type === "Hit")
      return okResponse(JSON.parse(getCache.valueString()));

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

    await cacheClient.set("staging-habits", cacheKey, JSON.stringify(Item));
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

    // Define attribute mapping
    const attributeMapping = {
      username: { dbField: "username", placeholder: ":username" },
      firstName: { dbField: "first_name", placeholder: ":first_name" },
      lastName: { dbField: "last_name", placeholder: ":last_name" },
      sex: { dbField: "sex", placeholder: ":sex" },
      birthDate: { dbField: "birth_date", placeholder: ":birth_date" },
    } as const;

    // Filter valid and changed attributes
    const updateAttributes = Object.keys(body).filter(
      (key) => key in attributeMapping && body[key] !== undefined,
    );

    if (updateAttributes.length === 0) {
      return badRequestResponse("No valid attributes provided for update");
    }

    // Username uniqueness check
    if (body.username) {
      const { Item: currentUser } = await client.send(
        new GetItemCommand({
          TableName: DYNAMODB_TABLE_USERS,
          Key: {
            user_id: { S: payload.sub },
          },
        }),
      );

      if (!currentUser || currentUser.username.S !== body.username) {
        const usernameExists = await checkUsernameExists(body.username);
        if (usernameExists) {
          return badRequestResponse("Username already exists");
        }
      }
    }

    // Build update expression and attribute values
    const { updateExpressions, expressionAttributeValues } =
      updateAttributes.reduce(
        (acc, attr) => {
          const { dbField, placeholder } =
            attributeMapping[attr as keyof typeof attributeMapping];
          acc.updateExpressions.push(`${dbField} = ${placeholder}`);
          acc.expressionAttributeValues[placeholder] = { S: body[attr] };
          return acc;
        },
        {
          updateExpressions: [] as string[],
          expressionAttributeValues: {} as Record<string, any>,
        },
      );

    // Handle full_name update if first_name or last_name is changing
    const isNameChanging =
      body.firstName !== undefined || body.lastName !== undefined;

    if (isNameChanging) {
      // Get current user data for the unchanged name part
      const { Item: currentUser } = await client.send(
        new GetItemCommand({
          TableName: DYNAMODB_TABLE_USERS,
          Key: {
            user_id: { S: payload.sub },
          },
        }),
      );

      if (currentUser) {
        const firstName = body.firstName || currentUser.first_name.S;
        const lastName = body.lastName || currentUser.last_name.S;
        const fullName = `${firstName} ${lastName}`.trim();

        updateExpressions.push("full_name = :full_name");
        expressionAttributeValues[":full_name"] = { S: fullName };
      }
    }

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

    await cacheClient.delete("staging-habits", `user:${payload.sub}`);
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
