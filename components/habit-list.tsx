import { habits } from "@/data/habits";
import HabitCard from "@/components/habit-card";

export default function HabitList() {
  return (
    <div className="grid grid-cols-2 gap-4">
      {habits.map((habit) => (
        <HabitCard key={habit.habitId} habit={habit} />
      ))}
    </div>
  );
}
