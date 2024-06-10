import Link from "next/link";

import GoogleSignIn from "@/components/auth/google-sign-in";
import SignInForm from "@/components/auth/signin-form";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-5">
      <div>
        <h1>Habits</h1>
        <p>Your research-based habit-tracking application.</p>
      </div>
      <SignInForm />
      <Separator />
      <GoogleSignIn />
      <p>
        Don&amp;t have an account? <Link href="/signup">Sign Up</Link>
      </p>
    </div>
  );
}
