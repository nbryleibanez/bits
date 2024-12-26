import { Suspense } from "react";
import Link from "next/link";

import HabitDetailsCard from "@/components/habit/habit-details-card";
import { ArrowLeft } from "lucide-react";

export default async function HabitPage(props: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type: string }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  return (
    <main className="min-h-screen w-full sm:flex sm:justify-center sm:items-center">
      <div className="min-h-screen sm:max-w-xl flex flex-col items-center sm:justify-center gap-4 p-6">
        <div className="w-full max-w-md cursor-pointer">
          <Link className="w-fit h-fit" href="/">
            <ArrowLeft className="h-8 w-8" />
          </Link>
        </div>
        <div className="flex-1 w-full flex flex-col gap-2 justify-between sm:justify-start">
          <HabitDetailsCard params={params} searchParams={searchParams} />
        </div>
      </div>
    </main>
  );
}
