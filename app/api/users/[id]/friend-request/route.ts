import { type NextRequest, NextResponse } from "next/server";
import { DynamoDBClient, UpdateItemCommand } from "@aws-sdk/client-dynamodb";
import { validateRequest } from "@/helpers/auth/validate-request";
import { unauthorizedResponse, internalServerErrorResponse } from "@/helpers/http/responses";

const client = new DynamoDBClient({});

export async function GET(request: NextRequest) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

  } catch (error: any) {
    console.error('Error in GET handler: ', error)
    return internalServerErrorResponse();
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const payload = await validateRequest(request);
    if (!payload) return unauthorizedResponse();

    const body = await request.json();

  } catch (error: any) {
    console.error('Error in POST handler: ', error)
    return internalServerErrorResponse();
  }
}
