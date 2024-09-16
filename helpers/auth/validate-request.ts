import { type NextRequest } from 'next/server'
import { verifyToken } from '@/utils/verify-token'

export async function validateRequest(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value as string;
  const payload = await verifyToken(token, "access");

  if (!payload) return null;
  return payload;
}
