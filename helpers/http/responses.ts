import { NextResponse } from 'next/server';

// 2XX Responses

// 200 OK
export const okResponse = (data?: any) => {
  if (data) return NextResponse.json({ message: 'OK', data: data }, { status: 200 })
  return NextResponse.json({ message: 'OK' }, { status: 200 })
}


// 4XX Responses

// 400 Bad Request
export const badRequestResponse = (message?: string): NextResponse<{ error: string }> => {
  if (message) return NextResponse.json({ error: 'Bad Request', message: message }, { status: 400 })
  return NextResponse.json({ error: 'Bad Request' }, { status: 400 })
}

// 401 Unauthorized
export const unauthorizedResponse = (): NextResponse<{ error: string }> =>
  NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

// 404 Not Found
export const notFoundResponse = (): NextResponse<{ error: string }> =>
  NextResponse.json({ error: 'Not Found' }, { status: 404 })

// 409 Conflict
export const conflictResponse = (message?: string): NextResponse<{ error: string }> => {
  if (message) return NextResponse.json({ error: 'Conflict', message: message }, { status: 409 })
  return NextResponse.json({ error: 'Conflict' }, { status: 409 })
}

// 5XX Responses

// 500 Internal Server Error
export const internalServerErrorResponse = (): NextResponse<{ error: string }> =>
  NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
