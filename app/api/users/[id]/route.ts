import { type NextRequest, NextResponse } from "next/server";
import {
  DynamoDBClient,
  GetItemCommand,
  PutItemCommand,
} from "@aws-sdk/client-dynamodb";

const client = new DynamoDBClient({});

export async function GET(
  req: NextRequest,
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

// export async function POST(
//   req: NextRequest,
//   { params }: { params: { id: string } },
// ) {
//
//   try {
//
//     const res = await client.send(new PutItemCommand({
//         TableName: TABLE_USERS,
//         Item: {
//           userId: { S: payload?.sub as string },
//           username: { S: "wer" },
//           email: { S: payload?.email as string },
//           firstName: { S: payload?.email as string },
//           friends: { SS: [""] },
//           fullName: { S: payload?.email as string },
//           lastName: { S: payload?.email as string },
//           profilePicUrl: { S: payload?.email as string },
//         },
//       }),
//     );
//
//     console.log(res);
//   } catch (e) {
//
//   }
//   return;
// }
