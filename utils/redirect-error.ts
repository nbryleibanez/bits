import { type NextRequest, NextResponse } from "next/server";

export function redirectError(request: NextRequest, error: any) {
  const params = new URLSearchParams();
  params.append("message", error.message);

  console.log(error);

  return NextResponse.redirect(
    new URL(`/error?${params.toString()}`, request.nextUrl),
  );
}
