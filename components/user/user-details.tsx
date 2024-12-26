import { cookies } from "next/headers";
import { getUserMe, getHabitsByUserId } from "@/lib/fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function UserDetails() {
  const cookieStore = await cookies();
  const data = await getUserMe(cookieStore);
  const habits = await getHabitsByUserId(cookieStore);

  console.log(data.habits.L);
  console.log(habits);

  const streaks = habits.map((item) => Number(item.streak.N));
  const highestStreak = Math.max(streaks);

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
      <div className="w-full h-fit flex items-center rounded-xl border border-grey-100">
        <div className="flex-1 p-4 border-r border-grey-100">
          <p className="font-light">Habits</p>
          <p className="text-2xl font-semibold">{habits.length}</p>
        </div>
        <div className="flex-1 p-4">
          <p className="font-light">Highest Streak</p>
          <p className="text-2xl font-semibold">{highestStreak}</p>
        </div>
      </div>
    </div>
  );
}
