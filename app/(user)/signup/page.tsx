import Link from "next/link";

import GoogleSignIn from "@/components/auth/google-sign-in";
import SignUpForm from "@/components/auth/signup-form";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SignUpPage() {
  return (
    <div className="sm:h-pull-minus-padding w-full flex justify-center items-center">
      <Card className="w-full sm:w-fit">
        <CardHeader>
          <CardTitle className="text-4xl font-semibold">Habits</CardTitle>
          <CardDescription>
            Your research-based habit-tracking application.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <SignUpForm />
          <Separator />
          <GoogleSignIn />
        </CardContent>
        <CardFooter>
          <p className="w-full text-sm text-center">
            Already have an account? <Link href="/signin">Sign In</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
