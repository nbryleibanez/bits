import AcceptHabitRequestButton from "@/components/habit/accept-habit-request-button";
import { X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function PendingHabitCard({ pendingHabit }: any) {
  return (
    <div className="aspect-square p-4 flex flex-col justify-between bg-white rounded-3xl shadow-md" >
      <div>
        <p>{pendingHabit.title.S}</p>
      </div>
      <div>
        <AcceptHabitRequestButton habitId={pendingHabit.habit_id.S} />
        <button>
          <X />
        </button>
      </div>
    </div>
  );
}
