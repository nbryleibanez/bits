import Link from "next/link";
import SignOutButton from "@/components/auth/signout-button";
import InstallButton from "@/components/install-button";
import UserDetails from "@/components/user/user-details";

import { ArrowLeft } from "lucide-react";

export default function UserPage() {
  return (
    <main className="min-h-dvh flex flex-col items-center sm:justify-center gap-4 p-5">
      <div className="w-full max-w-md">
        <Link className="w-fit h-fit" href="/">
          <ArrowLeft className="h-8 w-8" />
        </Link>
      </div>

      {/* Mobile view (up to sm breakpoint) */}
      <div className="flex-1 w-full max-w-md sm:hidden flex flex-col gap-8">
        <UserDetails />
        <div className="flex flex-col gap-2 mt-auto">
          <InstallButton />
          <SignOutButton />
        </div>
      </div>

      {/* Desktop view (sm breakpoint and above) */}
      <div className="w-full max-w-md hidden sm:block">
        <UserDetails />
        <div className="flex flex-col gap-2 mt-4">
          <InstallButton />
          <SignOutButton />
        </div>
      </div>
    </main>
  );
}
