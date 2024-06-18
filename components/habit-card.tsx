import Link from "next/link";

import { Habit } from "@/utils/interfaces";

interface Props {
  habit: Habit;
}

export default function HabitCard({ habit }: Props) {
  return (
    <Link
      href={`/habit/${habit.habitId}`}
      className="aspect-square p-4 flex flex-col justify-between bg-white rounded-3xl shadow-md"
    >
      <div className="w-full flex justify-between">
        <div>
          <div className="text-red-600 text-3xl font-bold">{habit.streak}</div>
          <div className="text-xs">streak</div>
        </div>
        <div>photo</div>
      </div>
      <div>{habit.title}</div>
    </Link>
  );
}
