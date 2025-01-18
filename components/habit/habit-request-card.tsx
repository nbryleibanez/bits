import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function HabitRequestCard({ habitRequest }: any) {
  return (
    <Link
      href={`habit-request/${habitRequest.habit_id.S}`}
      className="aspect-square p-4 flex flex-col justify-between bg-white rounded-3xl shadow-md"
    >
      <div className="w-full flex flex-row-reverse">
        <Avatar className="w-10 h-10">
          <AvatarImage src={habitRequest.duo_avatar_url.S} />
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
      </div>
      <div>
        <p className="text-xs font-light">Habit Request</p>
        <p className="text-xl font-medium">{habitRequest.title.S}</p>
      </div>
    </Link>
  );
}
