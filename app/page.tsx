import HabitList from "@/components/habit-list";
import ProfileCard from "@/components/profile-card";

export default async function Home() {
  return (
    <main className="relative flex h-dvh flex-col gap-4 p-5">
      <div className="h-full flex flex-col sm:flex-row gap-4">
        <ProfileCard />
        <HabitList />
      </div>
    </main>
  );
}
