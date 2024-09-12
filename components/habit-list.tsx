import Link from "next/link";
import { habits } from "@/data/habits";
import HabitCard from "@/components/habit-card";
import { PlusIcon } from "@radix-ui/react-icons"

export default function HabitList() {
  return (
    <div className="h-fit w-full grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      {habits.map((habit) => (
        <HabitCard key={habit.habitId} habit={habit} />
      ))}
      <Link
        href="/create"
        className="aspect-square flex justify-center items-center bg-zinc-100 rounded-3xl shadow-md"
      >
        <PlusIcon className="h-12 w-12" color="#999999" />
      </Link>
    </div>
  );
}
