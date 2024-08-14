import { type NextRequest, NextResponse } from "next/server";

export default function redirectError(req: NextRequest, e: any) {
  const params = new URLSearchParams();
  params.append("message", e.message);

  console.log(e);

  return NextResponse.redirect(
    new URL(`/error?${params.toString()}`, req.nextUrl),
  );
}
