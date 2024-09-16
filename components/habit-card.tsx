import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HabitCard({ habit }: any) {
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
        <div className="flex">
          {habit.participants.L.map((p: any) => (
            <Avatar className="w-10 h-10">
              <AvatarImage src={p.M.avatar_url.S} />
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          ))}
        </div>
      </div>
      <div>
        <p className="text-xl font-medium">{habit.title.S}</p>
      </div>
    </Link>
  );
}
