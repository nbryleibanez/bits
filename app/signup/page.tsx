import Link from "next/link";
import SignUpForm from "@/components/auth/signup-form";
import GoogleSignIn from "@/components/auth/google-sign-in";

import { Separator } from "@/components/ui/separator";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

export const metadata = {
  title: "Sign Up",
};

export default async function SignUpPage() {
  return (
    <main className="min-h-dvh p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your email below to create a new account.
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <SignUpForm />
          <Separator />
          <div className="space-y-4">
            <GoogleSignIn />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link className="text-sm underline" href="/signin">
            Already have an account? Sign In
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
