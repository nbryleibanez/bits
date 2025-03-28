import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth/tokens";
import {
  getHabitsByUserId,
  getHabitRequestsByUserId,
  getHabitRequestById,
} from "@/lib/fetch";

import HabitCard from "@/components/habit-card";
import HabitRequestCard from "@/components/habit/habit-request-card";
import { PlusIcon } from "@radix-ui/react-icons";

export default async function HabitList() {
  const cookieStore = await cookies();
  const idTokenPayload = await verifyToken(
    cookieStore.get("id_token")?.value as string,
    "id",
  );

  const habits = await getHabitsByUserId(
    cookieStore,
    idTokenPayload?.sub as string,
  );
  const habitRequests = await getHabitRequestsByUserId(
    cookieStore,
    idTokenPayload?.sub as string,
  );

  return (
    <div className="h-fit w-full grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {habits?.map((habit: any) => (
        <HabitCard
          key={habit.habit_id.S}
          cookieStore={cookieStore}
          habit={habit}
        />
      ))}
      {habitRequests.map((habitRequest: any) => (
        <HabitRequestCard
          key={habitRequest.M.habit_id.S}
          habitRequest={habitRequest.M}
        />
      ))}
      <Link
        href="/create"
        className="aspect-square flex justify-center items-center bg-zinc-100 rounded-3xl shadow-md"
      >
        <PlusIcon className="h-12 w-12" color="#999999" />
      </Link>
    </div>
  );
}
