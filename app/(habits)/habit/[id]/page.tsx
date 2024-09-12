import Link from "next/link";
import { cookies } from "next/headers";
import DeleteHabitButton from "@/components/habit/delete-habit-button";
import LogHabitButton from "@/components/habit/log-habit-button";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

export default async function HabitPage({ params }: { params: { id: string } }) {

  const res = await fetch(`${process.env.SITE}/api/habits/${params.id}`, {
    method: "GET",
    headers: {
      Cookie: cookies().toString(),
      "Content-Type": "application/json",
    },
  })

  const { habit } = await res.json()

  return (
    <main className="flex flex-col gap-4 p-6">
      <Link href="/">
        <ArrowLeftIcon className="h-8 w-8" />
      </Link>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm">Basic Habit</p>
              <p className="text-2xl font-medium">{habit.title.S}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-end">Streak</p>
              <p className="text-5xl font-semibold text-end">{habit.streak.N}</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex flex-col gap-2">
            <div className="text-sm">Participants</div>
            <Avatar className="w-10 h-10">
              <AvatarFallback>P</AvatarFallback>
            </Avatar>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <LogHabitButton streak={habit.streak.N} isLogged={habit.isLogged.BOOL} />
          <DeleteHabitButton />
        </CardFooter>
      </Card>
    </main>
  );
}
