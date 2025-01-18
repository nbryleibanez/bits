import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth/tokens";
import { getHabitRequestById } from "@/lib/fetch";

import ActionButtons from "./action-buttons";

import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CardHeader, CardContent, Card } from "@/components/ui/card";

export default async function HabitRequestDetailsCard({
  params,
}: {
  params: { id: string };
}) {
  const cookieStore = await cookies();
  const habitRequest = await getHabitRequestById(
    cookieStore.toString(),
    params.id,
  );
  console.log("habitRequest", habitRequest);

  const idTokenPayload = await verifyToken(
    (await cookies()).get("id_token")?.value as string,
    "id",
  );
  const myId = idTokenPayload?.sub as string;
  const myUsername = idTokenPayload?.["custom:username"] as string;

  return (
    <>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between">
            <div className="flex flex-col gap-1">
              <p className="text-sm">Duo</p>
              <p className="text-2xl font-medium">{habitRequest.title.S}</p>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-end">Habit Request</p>
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className="flex flex-col gap-4 pt-4">
            <div className="text-sm">Inviter</div>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={habitRequest.duo_avatar_url.S} />
                  <AvatarFallback>{habitRequest.duo_name.S[0]}</AvatarFallback>
                </Avatar>
                <p>{habitRequest.duo_name.S}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <ActionButtons
        habitId={habitRequest.habit_id.S}
        title={habitRequest.title.S}
        ownerId={habitRequest.duo_id.S}
        ownerUsername={habitRequest.duo_username.S}
        ownerFullName={habitRequest.duo_name.S}
        ownerAvatarUrl={habitRequest.duo_avatar_url.S}
        myId={myId}
        myUsername={myUsername}
      />
    </>
  );
}
