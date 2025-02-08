import Link from "next/link";
import SignOutButton from "@/components/auth/signout-button";
import InstallButton from "@/components/install-button";
import UserDetails from "@/components/user/user-details";
import { ArrowLeft } from "lucide-react";

export default function UserPage() {
  return (
    <main className="min-h-dvh flex flex-col gap-4 p-5">
      <Link href="/">
        <ArrowLeft className="h-8 w-8" />
      </Link>
      <UserDetails />
      <InstallButton />
      <SignOutButton />
    </main>
  );
}
