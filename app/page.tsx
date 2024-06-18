import HabitCard from "@/components/habit-card";
import ProfileCard from "@/components/profile-card";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>Home</h1>
      <ProfileCard />
      <HabitCard id="1" />
    </main>
  );
}
