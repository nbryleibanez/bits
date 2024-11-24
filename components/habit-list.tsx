import Link from "next/link";
import { cookies } from "next/headers";
import { getHabitsByUserId, getHabitRequestsByUserId } from "@/lib/fetch";

import HabitCard from "@/components/habit-card";
import HabitRequestCard from "@/components/habit/habit-request-card";
import { PlusIcon } from "@radix-ui/react-icons"

export default async function HabitList() {
  const habits = await getHabitsByUserId(cookies)
  const { habits_requests } = await getHabitRequestsByUserId(cookies)

  return (
    <div className="h-fit w-full grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {habits?.map((habit: any) => (
        <HabitCard key={habit.habit_id.S} habit={habit} />
      ))}
      {habits_requests.L.map((habitRequest: any, index: number) => (
        <HabitRequestCard key={habitRequest.M.habit_id.S} habitRequest={habitRequest.M} index={index} />
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
