import { getUserById } from "@/lib/fetch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircledIcon, CircleIcon } from "@radix-ui/react-icons";

export default async function ParticipantItem({
  cookieStore,
  userId,
  isLogged,
}: {
  cookieStore: any;
  userId: string;
  isLogged: boolean;
}) {
  const data = await getUserById(cookieStore.toString(), userId);

  return (
    <div className="w-full flex items-center gap-2">
      <div className="flex-1 flex items-center gap-2">
        <Avatar className="w-8 h-8">
          <AvatarImage src={data.avatar_url.S} />
          <AvatarFallback>{data.full_name.S[0]}</AvatarFallback>
        </Avatar>
        <p>{data.full_name.S}</p>
      </div>
      {isLogged ? (
        <CheckCircledIcon className="h-5 w-5" />
      ) : (
        <CircleIcon className="h-5 w-5" />
      )}
    </div>
  );
}
