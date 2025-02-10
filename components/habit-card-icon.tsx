import { getUserById } from "@/lib/fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function HabitCardIcon({
  cookieStore,
  userId,
}: {
  cookieStore: any;
  userId: string;
}) {
  const data = await getUserById(cookieStore.toString(), userId);

  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={data.avatar_url.S} />
      <AvatarFallback>{data.full_name.S[0]}</AvatarFallback>
    </Avatar>
  );
}
