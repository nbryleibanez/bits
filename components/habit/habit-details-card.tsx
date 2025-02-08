import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth/tokens";
import { getHabit } from "@/lib/fetch";

import ActionButtons from "@/components/habit/action-buttons";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader, CardContent, Card } from "@/components/ui/card";

export default async function HabitDetailsCard({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type: string };
}) {
  const { data } = await getHabit(
    (await cookies()).toString(),
    params.id,
    searchParams.type,
  );

  const idTokenPayload = await verifyToken(
    (await cookies()).get("id_token")?.value as string,
    "id",
  );
  const userId = idTokenPayload?.sub as string;
  const username = idTokenPayload?.["custom:username"] as string;
  const participant = data.participants.L.find(
    (p: any) => p.M.user_id.S === idTokenPayload?.sub,
  );
  const isLogged = participant?.M.is_logged.BOOL;

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm mb-4">
                {data.habit_type.S === "basic" && "Basic"}
                {data.habit_type.S === "cue" && "Cue"}
                {data.habit_type.S === "duo" && "Duo"} Habit
              </p>
              {data.habit_type.S === "cue" ? (
                <>
                  <div>
                    <p className="text-sm font-light">Cue</p>
                    <p className="text-xl font-medium">{data.cue.S}</p>
                  </div>
                  <div>
                    <p className="text-sm font-light">Action</p>
                    <p className="text-xl font-medium">{data.title.S}</p>
                  </div>
                </>
              ) : null}
              {data.habit_type.S !== "cue" ? (
                <p className="text-2xl font-medium">{data.title.S}</p>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-end">Streak</p>
              <p className="text-5xl font-semibold text-end">{data.streak.N}</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex flex-col gap-4 pt-4">
            <div className="text-sm">Participants</div>
            <div className="flex flex-col gap-3">
              {data.participants.L.map((participant: any) => (
                <div
                  key={participant.M.user_id.S}
                  className="flex items-center gap-2"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={participant.M.avatar_url.S} />
                    <AvatarFallback>
                      {participant.M.full_name.S[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p>{participant.M.full_name.S}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <ActionButtons
        userId={userId}
        username={username}
        owner={data.owner.S}
        isLogged={isLogged}
      />
    </>
  );
}
