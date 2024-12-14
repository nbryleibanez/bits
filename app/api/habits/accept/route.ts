import { type NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache"
import { DynamoDBClient, UpdateItemCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";

import { habitSchema } from "@/lib/schema";
import { validateTokens } from "@/utils/auth/tokens";
import { unauthorizedResponse, internalServerErrorResponse } from "@/utils/http/responses";

const client = new DynamoDBClient({});
const { DYNAMODB_TABLE_USERS, DYNAMODB_TABLE_HABITS } = process.env;

export async function POST(request: NextRequest) {
  try {
    const payload = await validateTokens(request);
    if (!payload) return unauthorizedResponse();

    const {
      index,
      habitId,
      title,
      type,
      ownerId,
      ownerFullName,
      ownerAvatarUrl,
    } = await request.json();

    const { data, success } = habitSchema.safeParse({
      habit_id: habitId,
      habit_type: type,
      owner: payload.access.sub,
      title: title,
      streak: 0,
      created_date: new Date().toISOString(),
      participants: [
        {
          user_id: ownerId,
          full_name: ownerFullName,
          avatar_url: ownerAvatarUrl,
          role: 'owner',
          is_logged: false,
        },
        {
          user_id: payload.access.sub,
          full_name: payload.id.name,
          avatar_url: payload.id.picture,
          role: 'participant',
          is_logged: false,
        }
      ],
    });

    if (!success) return internalServerErrorResponse();

    const putItemCommandResponse = await client.send(
      new PutItemCommand({
        TableName: DYNAMODB_TABLE_HABITS,
        Item: {
          habit_id: { S: data.habit_id },
          habit_type: { S: data.habit_type },
          owner: { S: data.owner },
          title: { S: data.title },
          streak: { N: data.streak.toString() },
          created_date: { S: data.created_date },
          participants: {
            L: data.participants.map(participant => ({
              M: {
                user_id: { S: participant.user_id },
                full_name: { S: participant.full_name },
                avatar_url: { S: participant.avatar_url },
                role: { S: participant.role },
                is_logged: { BOOL: participant.is_logged },
              }
            })),
          },
        }
      })
    );

    if (putItemCommandResponse.$metadata.httpStatusCode !== 200) return internalServerErrorResponse();

    const users = [payload.access.sub, ownerId];

    await Promise.all(users.map(async (userId) => {
      const isAcceptee = userId === payload.access.sub;
      const updateUsersResponse = await client.send(
        new UpdateItemCommand({
          TableName: DYNAMODB_TABLE_USERS,
          Key: {
            user_id: { S: userId },
          },
          UpdateExpression:
            isAcceptee ?
              `SET habits = list_append(habits, :habit) REMOVE habits_requests[${index}]` :
              `SET habits = list_append(habits, :habit)`,
          ExpressionAttributeValues: {
            ":habit": {
              L: [
                {
                  M: {
                    habit_id: { S: habitId },
                    habit_type: { S: type },
                    title: { S: title },
                  }
                }
              ]
            }
          }
        })
      );

      if (updateUsersResponse.$metadata.httpStatusCode !== 200) {
        throw new Error(`Failed to update user ${userId}`);
      }
    }));

    revalidateTag('habits')

    return NextResponse.json({ habitId }, { status: 200 });
  } catch (error) {
    console.error("Error in PATCH handler:", error);
    return internalServerErrorResponse();
  }
}
