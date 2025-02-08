import Link from "next/link";
import { cookies } from "next/headers";
import { getUserMe } from "@/lib/fetch";
import DuoHabitForm from "@/components/habit/duo-habit-form";
import { ArrowLeft } from "lucide-react";

import { CardHeader, CardContent, Card } from "@/components/ui/card";

export default async function Page() {
  const cookieStore = await cookies();
  const data = await getUserMe(cookieStore);

  return (
    <main className="flex flex-col min-h-dvh items-center sm:justify-center p-5 gap-4">
      <div className="w-full max-w-md">
        <Link className="w-fit h-fit" href="/create">
          <ArrowLeft className="h-8 w-8" />
        </Link>
      </div>

      {/* Mobile view (up to sm breakpoint) */}
      <div className="flex-1 w-full max-w-md sm:hidden flex flex-col gap-8">
        <div>
          <h1 className="text-xl font-semibold">Create Duo Habit</h1>
          <p className="mt-2 text-gray-600">
            Remember: Two is better than one.
          </p>
        </div>
        <DuoHabitForm data={data} />
      </div>

      {/* Desktop view (sm breakpoint and above) */}
      <Card className="w-full max-w-md hidden sm:block">
        <CardHeader>
          <div>
            <h1 className="text-xl font-semibold">Create Duo Habit</h1>
            <p className="text-gray-600">Remember: Two is better than one.</p>
          </div>
        </CardHeader>
        <CardContent>
          <DuoHabitForm data={data} />
        </CardContent>
      </Card>
    </main>
  );
}
