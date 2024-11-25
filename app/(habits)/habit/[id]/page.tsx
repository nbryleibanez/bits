import { Suspense } from "react";
import Link from "next/link"

import HabitDetailsCard from "@/components/habit/habit-details-card";
import { ArrowLeft } from "lucide-react";

export default async function HabitPage(
  props: {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ type: string }>
  }
) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center gap-4 p-6">
      <div className="absolute left-5 top-5 sm:relative sm:left-0 sm:top-0 w-full max-w-md cursor-pointer">
        <Link className="w-fit h-fit" href="/">
          <ArrowLeft className="h-8 w-8" />
        </Link>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <HabitDetailsCard params={params} searchParams={searchParams} />
      </Suspense>
    </main>
  );
}
