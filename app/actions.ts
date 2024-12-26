"use server";

import { revalidateTag, revalidatePath } from "next/cache";

export async function revalidateHabits() {
  revalidateTag("habits");
}

export async function revalidateHabit(id: string) {
  revalidateTag(`habit/${id}`);
}

export async function revalidateMe() {
  revalidateTag("users/me");
}
