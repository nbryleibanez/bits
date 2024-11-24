import { cookies } from "next/headers"

export function setCookie(
  cookieStore: ReturnType<typeof cookies>,
  name: string,
  value: string | undefined,
  maxAge: number
): void {
  if (value) {
    cookieStore.set(name, value, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: maxAge,
    })
  }
}
