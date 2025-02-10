import { Suspense } from "react";
import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth/tokens";
import { getHabit } from "@/lib/fetch";

import ActionButtons from "@/components/habit/action-buttons";
import ParticipantItem from "@/app/(habits)/habit/[id]/participant-item";

import { Separator } from "@/components/ui/separator";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default async function HabitDetailsCard({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { type: string };
}) {
  const cookieStore = await cookies();
  const { data } = await getHabit(
    cookieStore.toString(),
    params.id,
    searchParams.type,
  );

  const idTokenPayload = await verifyToken(
    cookieStore.get("id_token")?.value as string,
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
      <Card className="w-full max-w-md mb-4">
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
              {data.participants.L.map((p: any, i: any) => (
                <Suspense
                  key={i}
                  fallback={<Skeleton className="h-8 w-[200px]" />}
                >
                  <ParticipantItem
                    cookieStore={cookieStore}
                    userId={p.M.user_id.S}
                    isLogged={p.M.is_logged.BOOL}
                  />
                </Suspense>
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
