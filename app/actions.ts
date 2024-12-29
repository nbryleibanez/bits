"use server";

import { revalidateTag } from "next/cache";

export async function revalidateHabits() {
  revalidateTag("habits");
}

export async function revalidateHabit(id: string) {
  revalidateTag(`habit/${id}`);
}

export async function revalidateMe() {
  revalidateTag("user/me");
}

export async function revalidateUser(i: string) {
  revalidateTag(`user/${i}`);
}
