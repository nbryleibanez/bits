import HabitList from "@/components/habit-list";
import ProfileCard from "@/components/profile-card";
import NavBar from "@/components/nav-bar";

export default function Home() {
  return (
    <main className="relative flex h-dvh flex-col gap-4">
      <h1 className="text-lg font-bold">Home</h1>
      <ProfileCard />
      <HabitList />
      <NavBar />
    </main>
  );
}
