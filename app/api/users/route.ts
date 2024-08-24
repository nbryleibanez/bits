import { type NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";
import verifyToken from "@/utils/verify-token";

const client = new DynamoDBClient({});

const { TABLE_USERS } = process.env;

export async function GET(request: NextRequest) {
  return NextResponse.next();
}

export async function POST(req: NextRequest) {
  const cookieStore = cookies();

  if (!cookieStore.has("accessToken")) {
    return new Response(
      JSON.stringify({
        message: "Unauthorized Access",
      }),
      {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  try {
    const body = await req.json();
    const fullName = `${body.firstName} ${body.lastName}`;

    console.log(body);
    const idToken = cookieStore.get("idToken")?.value as string;
    const { payload, error } = await verifyToken(idToken, "id");

    if (error) throw new Error(error.toString());

    const res = await client.send(
      new PutItemCommand({
        TableName: TABLE_USERS,
        Item: {
          userId: { S: payload?.sub as string },
          username: { S: body.username },
          email: { S: payload?.email as string },
          firstName: { S: body.firstName as string },
          friends: { SS: [""] },
          fullName: { S: fullName as string },
          lastName: { S: body.lastName as string },
          profilePicUrl: { S: payload?.picture as string },
        },
      }),
    );

    if (res.$metadata.httpStatusCode == 200) {
      return new NextResponse(
        JSON.stringify({
          status: res.$metadata.httpStatusCode,
          message: "Successful.",
        }),
        {
          status: res.$metadata.httpStatusCode,
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
    }
  } catch (e: any) {
    console.log("error checkpoint");
    return new NextResponse(
      JSON.stringify({
        status: e.$metadata.httpStatusCode,
        message: `${e.message}`,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }

  return NextResponse.json({ accessToken: "bruh" });
}
