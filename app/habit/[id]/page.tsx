import Link from "next/link";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { habits } from "@/data/habits";

export default function HabitPage({ params }: { params: { id: string } }) {
  const getHabit = (id: string) => {
    return habits.find((habit) => habit.habitId === id);
  };

  const data = getHabit(params.id);

  return (
    <div className="flex flex-col gap-4">
      <Link href="/">
        <ArrowLeftIcon className="h-8 w-8" />
      </Link>
      <div className="flex flex-col gap-5 p-6 rounded-3xl bg-white">
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-sm">Basic Habit</p>
            <p className="text-2xl font-medium">{data?.title}</p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-end">Streak</p>
            <p className="text-5xl font-semibold text-end">{data?.streak}</p>
          </div>
        </div>
        <Separator />
        <div>
          <div className="flex flex-col gap-2">
            <div className="text-sm">Participants</div>
            <Avatar className="w-10 h-10">
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>
      <Button className="h-12 rounded-3xl">Log Habit</Button>
    </div>
  );
}
