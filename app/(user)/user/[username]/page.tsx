import { cookies } from "next/headers";
import { getUserMe, getUserByUsername, getHabitsByUserId } from "@/lib/fetch";

import BackButton from "@/components/back-button";
import AddFriendButton from "@/components/friends/add-friend-button";
import AcceptRequestButton from "@/components/friends/accept-request-button";
import UnfriendButton from "@/components/friends/unfriend-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function Page(props: {
  params: Promise<{ username: string }>;
}) {
  const cookieStore = await cookies();
  const params = await props.params;
  const me = await getUserMe(cookieStore);
  const user = await getUserByUsername(cookieStore, params.username);
  const habits = await getHabitsByUserId(cookieStore, user.user_id.S);

  let highestStreak;
  if (habits.length === 0) {
    highestStreak = 0;
  } else {
    const streaks = habits.map((item: any) => Number(item.streak.N));
    highestStreak = Math.max(...streaks);
  }

  const isFriend = me.friends.L.some(
    (f: any) => f.M?.username?.S === params.username,
  );

  const isRequesting = me.friend_requests.L.some(
    (f: any) => f.M?.username?.S === params.username,
  );

  const isSentRequest = user.friend_requests.L.some(
    (r: any) => r.M?.user_id.S === me.user_id.S,
  );

  const index = me.friend_requests.L.findIndex(
    (r: any) => r.M?.username.S === params.username,
  );

  return (
    <main className="min-h-dvh flex flex-col gap-4 p-5">
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
      {isFriend ? (
        <UnfriendButton
          sourceUserId={me.user_id.S as string}
          targetUserId={user.user_id.S as string}
        />
      ) : isRequesting ? (
        <AcceptRequestButton
          sourceUserId={me.user_id.S as string}
          sourceUsername={me.username.S as string}
          sourceFullName={me.full_name.S as string}
          sourceAvatarUrl={me.avatar_url.S as string}
          targetUserId={user.user_id.S as string}
          targetUsername={user.username.S as string}
          targetFullName={user.full_name.S as string}
          targetAvatarUrl={user.avatar_url.S as string}
          index={index}
        />
      ) : (
        <AddFriendButton
          isSentRequest={isSentRequest}
          sourceUsername={me.username.S as string}
          targetUsername={user.username.S as string}
        />
      )}
    </main>
  );
}
