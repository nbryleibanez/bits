import Link from "next/link";
import SignOutButton from "@/components/auth/signout-button";
import UserDetails from "@/components/user/user-details";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserPage() {
  return (
    <main className="flex flex-col gap-4 p-5">
      <Link href="/">
        <ArrowLeft className="h-8 w-8" />
      </Link>
      <UserDetails />
      <Link href="/">
        <Button variant="outline" className="w-full h-12 rounded-xl">
          Edit Profile
        </Button>
      </Link>
      <SignOutButton />
    </main>
  );
}
