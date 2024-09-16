import { type NextRequest, NextResponse } from "next/server"
import { DynamoDBClient, GetItemCommand } from "@aws-sdk/client-dynamodb"
import { verifyToken } from "@/utils/verify-token"
import { validateRequest } from "@/helpers/auth/validate-request"
import { unauthorizedResponse, internalServerErrorResponse } from "@/helpers/http/responses"

const client = new DynamoDBClient({})
const { DYNAMODB_TABLE_USERS } = process.env;

export async function GET(request: NextRequest) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

    const idToken = request.cookies.get("id_token")?.value as string;
    const idTokenPayload = await verifyToken(idToken, "id");
    if (!idTokenPayload) return internalServerErrorResponse();

    const { $metadata, Item } = await client.send(
      new GetItemCommand({
        TableName: DYNAMODB_TABLE_USERS,
        Key: {
          user_id: { S: payload.sub },
          username: { S: idTokenPayload["custom:username"] as string }
        }
      })
    )

    if ($metadata.httpStatusCode !== 200 || !Item) return internalServerErrorResponse()
    return NextResponse.json({ Item }, { status: 200 })
  } catch (error) {
    console.error('Error in GET handler: ', error)
    return internalServerErrorResponse()
  }
}
