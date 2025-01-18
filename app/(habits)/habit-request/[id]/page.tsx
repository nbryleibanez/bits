import Link from "next/link";

import HabitRequestDetailsCard from "./habit-request-details-card";
import { ArrowLeft } from "lucide-react";

export default async function HabitPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  return (
    <main className="min-h-dvh w-full sm:flex sm:justify-center sm:items-center">
      <div className="min-h-dvh sm:max-w-xl flex flex-col items-center sm:justify-center gap-4 p-6">
        <div className="w-full max-w-md cursor-pointer">
          <Link className="w-fit h-fit" href="/">
            <ArrowLeft className="h-8 w-8" />
          </Link>
        </div>
        <div className="flex-1 w-full flex flex-col gap-2 justify-between sm:justify-start">
          <HabitRequestDetailsCard params={params} />
        </div>
      </div>
    </main>
  );
}
