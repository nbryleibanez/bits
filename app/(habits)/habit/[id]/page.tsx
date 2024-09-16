import Link from "next/link";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/verify-token";
import DeleteHabitButton from "@/components/habit/delete-habit-button";
import LogHabitButton from "@/components/habit/log-habit-button";

import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

  const idTokenPayload = await verifyToken(cookies().get("id_token")?.value as string, "id")
  const { Item } = await res.json()
  const participant = Item.participants.L.find((p: any) => p.M.user_id.S === idTokenPayload?.sub)
  const isLogged = participant?.M.is_logged.BOOL

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
              <p className="text-2xl font-medium">{Item.title.S}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-end">Streak</p>
              <p className="text-5xl font-semibold text-end">{Item.streak.N}</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex flex-col gap-4 pt-4">
            <div className="text-sm">Participants</div>
            <div>
              {Item.participants.L.map((participant: any) => (
                <div key={participant.M.user_id.S} className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={participant.M.avatar_url.S} />
                  </Avatar>
                  <p>{participant.M.full_name.S}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <LogHabitButton streak={Item.streak.N} isLogged={isLogged} />
          <DeleteHabitButton />
        </CardFooter>
      </Card>
    </main>
  );
}
