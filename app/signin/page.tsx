import Link from "next/link";

import GoogleSignIn from "@/components/auth/google-sign-in";
import SignInForm from "@/components/auth/signin-form";

import { Separator } from "@/components/ui/separator";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

export default function SignInPage() {
  return (
    <main className="min-h-screen p-4 flex flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Welcome</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your email below to login to your account
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <SignInForm />
          <Separator />
          <div className="space-y-4">
            <GoogleSignIn />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link className="text-sm underline" href="/signup">
            Don&apos;t have an account? Sign up here
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
}
