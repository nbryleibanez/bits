import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Habit } from "@/utils/interfaces";

interface Props {
  habit: Habit;
}

export default function HabitCard({ habit }: Props) {
  return (
    <Link
      href={`/habit/${habit.habit_id.S}`}
      className="aspect-square p-4 flex flex-col justify-between bg-white rounded-3xl shadow-md"
    >
      <div className="w-full flex justify-between">
        <div>
          <div className="text-red-600 text-4xl font-bold">{habit.streak.N}</div>
          <div className="text-xs">streak</div>
        </div>
        <Avatar className="w-10 h-10">
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <p className="text-xl font-medium">{habit.title.S}</p>
      </div>
    </Link>
  );
}
