import Link from "next/link";
import { cookies } from "next/headers";
import { getUserMe, getHabitsByUserId } from "@/lib/fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ChevronRight } from "lucide-react";

export default async function UserDetails() {
  const cookieStore = await cookies();
  const data = await getUserMe(cookieStore);
  const habits = await getHabitsByUserId(cookieStore);

  let highestStreak;
  if (habits.length === 0) {
    highestStreak = 0;
  } else {
    const streaks = habits.map((item: any) => Number(item.streak.N));
    highestStreak = Math.max(...streaks);
  }

  return (
    <div className="min-h-fit space-y-4">
      <div className="flex flex-col items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={data.avatar_url.S} />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-center">
          <p className="font-semibold">{data.full_name.S}</p>
          <p>@{data.username.S}</p>
        </div>
      </div>
      <div className="w-full h-fit flex items-center rounded-xl border border-gray-200">
        <div className="flex-1 p-4 border-r border-gray-200">
          <p className="font-light">Habits</p>
          <p className="text-2xl font-semibold">{habits.length}</p>
        </div>
        <div className="flex-1 p-4">
          <p className="font-light">Highest Streak</p>
          <p className="text-2xl font-semibold">{highestStreak}</p>
        </div>
      </div>
      <div className="w-full h-fit flex flex-col gap-3 p-4 rounded-xl border border-gray-200">
        <div className="flex justify-between">
          <p>Username</p>
          <div className="flex gap-2">
            <p className="text-gray-600">{data.username.S}</p>
            <Link href="/user/me/edit/username">
              <ChevronRight />
            </Link>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <p>Name</p>
          <div className="flex gap-2">
            <p className="text-gray-600">{data.full_name.S}</p>
            <Link href="/user/me/edit/name">
              <ChevronRight />
            </Link>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <p>Sex</p>
          <div className="flex gap-2">
            <p className="text-gray-600">{data.sex.S}</p>
            <Link href="/user/me/edit/sex">
              <ChevronRight />
            </Link>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between">
          <p>Date of Birth</p>
          <div className="flex gap-2">
            <p className="text-gray-600">{data.birth_date.S}</p>
            <Link href="/user/me/edit/birth-date">
              <ChevronRight />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
