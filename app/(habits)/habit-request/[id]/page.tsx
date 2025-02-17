import Link from "next/link";

import HabitRequestDetailsCard from "./habit-request-details-card";
import { ArrowLeft } from "lucide-react";

export default async function HabitPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;

  return (
    <main className="min-h-dvh flex flex-col items-center sm:justify-center p-5 gap-4">
      <div className="w-full max-w-md cursor-pointer">
        <Link className="w-fit h-fit" href="/">
          <ArrowLeft className="h-8 w-8" />
        </Link>
      </div>

      {/* Mobile view (up to sm breakpoint) */}
      <div className="flex-1 w-full max-w-md sm:hidden flex flex-col gap-8">
        <HabitRequestDetailsCard params={params} />
      </div>

      {/* Desktop view (sm breakpoint and above) */}
      <div className="w-full max-w-md hidden sm:block">
        <HabitRequestDetailsCard params={params} />
      </div>
    </main>
  );
}
