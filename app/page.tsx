import HabitList from "@/components/habit-list";
import ProfileCard from "@/components/profile-card";
import NavBar from "@/components/nav-bar";

export default function Home() {
  return (
    <main className="relative flex h-dvh flex-col gap-4 p-5">
      <div className="h-full flex flex-col md:flex-row gap-4">
        <ProfileCard />
        <HabitList />
      </div>
      <NavBar />
    </main>
  );
}
