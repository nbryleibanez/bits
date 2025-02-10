import { Suspense } from "react";
import Link from "next/link";
import HabitCardIcon from "./habit-card-icon";
import { Skeleton } from "@/components/ui/skeleton";

export default function HabitCard({ cookieStore, habit }: any) {
  return (
    <Link
      href={`/habit/${habit.habit_id.S}?type=${habit.habit_type.S}`}
      className="aspect-square p-4 flex flex-col justify-between bg-white rounded-3xl shadow-md"
    >
      <div className="w-full flex justify-between">
        <div>
          <div className="text-4xl font-bold">{habit.streak.N}</div>
          <div className="text-xs">streak</div>
        </div>
        <div className="flex gap-1">
          {habit.participants.L.map((p: any, i: any) => (
            <Suspense
              key={i}
              fallback={<Skeleton className="h-10 w-10 rounded-full" />}
            >
              <HabitCardIcon cookieStore={cookieStore} userId={p.M.user_id.S} />
            </Suspense>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xl font-medium">{habit.title.S}</p>
      </div>
    </Link>
  );
}
