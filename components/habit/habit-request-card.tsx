import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import HabitRequestButtons from "@/components/habit/habit-request-buttons"

export default function HabitRequestCard({ habitRequest, index }: any) {
  return (
    <div
      className="aspect-square p-4 flex flex-col justify-between bg-white rounded-3xl shadow-md"
    >
      <div className="w-full flex justify-between">
        <p>{habitRequest.title.S}</p>
        <Avatar className="w-10 h-10">
          <AvatarImage src={habitRequest.duo_avatar_url.S} />
          <AvatarFallback>P</AvatarFallback>
        </Avatar>
      </div>
      <HabitRequestButtons
        index={index}
        habitId={habitRequest.habit_id.S}
        type={habitRequest.habit_type.S}
        title={habitRequest.title.S}
        ownerId={habitRequest.duo_id.S}
        ownerFullName={habitRequest.duo_name.S}
        ownerAvatarUrl={habitRequest.duo_avatar_url.S}
      />
    </div>
  );
}
