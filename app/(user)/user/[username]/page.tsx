import { cookies } from "next/headers";
import { getUserMe, getUserByUsername, getHabitsByUserId } from "@/lib/fetch";

import AddFriendButton from "@/components/friends/add-friend-button";
import AcceptRequestButton from "@/components/friends/accept-request-button";
import BackButton from "@/components/back-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Page(props: {
  params: Promise<{ username: string }>;
}) {
  const cookieStore = await cookies();
  const params = await props.params;
  const me = await getUserMe(cookieStore);
  const user = await getUserByUsername(cookieStore, params.username);
  const habits = await getHabitsByUserId(cookieStore);

  const isFriend = me.friends.L.some(
    (f: any) => f.M?.username?.S === params.username,
  );

  const isRequesting = me.friend_requests.L.some(
    (f: any) => f.M?.username?.S === params.username,
  );

  const isSentRequest = user.friend_requests.L.some(
    (r: any) => r.M?.user_id.S === me.user_id.S,
  );

  let highestStreak;
  if (habits.length === 0) {
    highestStreak = 0;
  } else {
    const streaks = habits.map((item: any) => Number(item.streak.N));
    highestStreak = Math.max(...streaks);
  }

  return (
    <main className="min-h-screen flex flex-col gap-4 p-5">
      <BackButton />
      <div className="min-h-fit space-y-4">
        <div className="flex flex-col items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url.S} />
            <AvatarFallback>S</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-center">
            <p className="font-semibold">{user.full_name.S}</p>
            <p>@{user.username.S}</p>
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
      </div>
      {isFriend ? null : isRequesting ? (
        <AcceptRequestButton />
      ) : (
        <AddFriendButton
          isSentRequest={isSentRequest}
          username={user.username.S}
        />
      )}
    </main>
  );
}
