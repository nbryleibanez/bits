import { NextResponse } from 'next/server';

export const badRequestResponse = (message?: string): NextResponse<{ error: string }> => {
  if (message) return NextResponse.json({ error: 'Bad Request', message: message }, { status: 400 })
  return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
}

export const unauthorizedResponse = (): NextResponse<{ error: string }> =>
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

export const internalServerErrorResponse = (): NextResponse<{ error: string }> =>
  NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
