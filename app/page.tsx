import { Suspense } from "react";

import HabitList from "@/components/habit-list";
import ProfileCard from "@/components/profile-card";
import HabitListSkeleton from "@/components/skeletons/habit-list-skeleton";

export default function Home() {
  return (
    <main className="relative flex h-dvh flex-col gap-4 p-5">
      <div className="h-full flex flex-col sm:flex-row gap-4">
        <ProfileCard />
        <Suspense fallback={<HabitListSkeleton />}>
          <HabitList />
        </Suspense>
      </div>
    </main>
  );
}
