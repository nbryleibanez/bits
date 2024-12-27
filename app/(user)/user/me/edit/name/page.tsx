import Link from "next/link";
import EditNameForm from "./form";

import { cookies } from "next/headers";
import { getUserMe } from "@/lib/fetch";

import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default async function Page() {
  const cookieStore = await cookies();
  const { first_name, last_name } = await getUserMe(cookieStore);

  return (
    <main className="flex flex-col gap-8 sm:gap-4 min-h-screen items-center sm:justify-center p-5">
      <div className="w-full max-w-md">
        <Link className="w-fit h-fit" href="/user/me">
          <ArrowLeft className="h-8 w-8" />
        </Link>
      </div>

      {/* Mobile view (up to sm breakpoint) */}
      <div className="flex-1 w-full max-w-md sm:hidden flex flex-col gap-4">
        <div>
          <h1 className="text-xl font-semibold">Edit Name</h1>
        </div>
        <EditNameForm firstName={first_name.S} lastName={last_name.S} />
      </div>

      {/* Desktop view (sm breakpoint and above) */}
      <Card className="w-full max-w-md hidden sm:block">
        <CardHeader>
          <div>
            <h1 className="text-xl font-semibold">Edit Name</h1>
          </div>
        </CardHeader>
        <CardContent>
          <EditNameForm firstName={first_name.S} lastName={last_name.S} />
        </CardContent>
      </Card>
    </main>
  );
}
