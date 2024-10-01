// import { type NextRequest, NextResponse } from "next/server";
// import {
//   DynamoDBClient,
//   GetItemCommand,
//   BatchGetItemCommand,
// } from "@aws-sdk/client-dynamodb";
//
// import { validateAccessToken } from "@/utils/auth/tokens";
// import { internalServerErrorResponse, unauthorizedResponse } from "@/utils/http/responses";
//
// const client = new DynamoDBClient({});
// const { DYNAMODB_TABLE_USERS } = process.env;
//
// export async function GET(request: NextRequest) {
//   try {
//     const payload = await validateAccessToken(request)
//     if (!payload) return unauthorizedResponse()
//
//     const getHabitRequestsIdsResponse = await client.send(
//       new GetItemCommand({
//         TableName: DYNAMODB_TABLE_USERS,
//         Key: {
//           user_id: { S: payload.sub as string },
//         },
//       })
//     )
//
//     const habitRequestsIds = getHabitRequestsIdsResponse.Item?.habits_requests.SS || []
//     const habitIdsLength = habitRequestsIds.filter(item => item !== "__EMPTY__").length;
//
//     if (habitIdsLength === 0) {
//       return NextResponse.json({ habits: [] }, { status: 200 })
//     }
//
//     const getHabitRequestsResponse = await client.send(
//       new BatchGetItemCommand({
//         RequestItems: {
//           "bits-habits-staging": {
//             Keys: habitRequestsIds.map()
//           }
//         }
//       })
//     )
//
//   } catch (error) {
//     console.error("Error in GET handler: ", error)
//     return internalServerErrorResponse
//   }
// }
