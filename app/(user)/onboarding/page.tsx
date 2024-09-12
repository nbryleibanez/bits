import { cookies } from "next/headers";
import verifyToken from "@/utils/verify-token";

import OnboardingForm from "@/components/user/onboarding-form";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";

export default async function OnboardingPage() {
  const cookieStore = cookies();
  const idToken = cookieStore.get("id_token")?.value as string;
  const { payload, error } = await verifyToken(idToken, "id");

  console.log(payload)

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-3xl font-bold">Let's get you started</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Enter your email below to login to your account
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <OnboardingForm firstName={payload?.given_name as string} lastName={payload?.family_name as string} />
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </main>
  );
}
