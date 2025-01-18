"use server";

import { revalidateTag } from "next/cache";

export async function revalidateHabit(id: string) {
  revalidateTag(`habit/${id}`);
}

export async function revalidateHabits(userId: string) {
  revalidateTag(`user/${userId}/habits`);
}

export async function revalidateHabitRequest(id: string) {
  revalidateTag(`habitRequest/${id}`);
}

export async function revalidateHabitRequests(userId: string) {
  revalidateTag(`user/${userId}/habitRequests`);
}

export async function revalidateUser(username: string) {
  revalidateTag(`user/${username}`);
}
