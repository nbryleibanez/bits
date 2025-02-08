import { cookies } from "next/headers";
import { verifyToken } from "@/utils/auth/tokens";

import OnboardingForm from "@/components/user/onboarding-form";
import { CardHeader, CardContent, Card } from "@/components/ui/card";

export const metadata = {
  title: "Onboarding",
};

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const idToken = cookieStore.get("id_token")?.value as string;
  const payload = await verifyToken(idToken, "id");

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div>
            <h1 className="text-3xl font-bold">Let&apos;s get you started</h1>
          </div>
        </CardHeader>
        <CardContent>
          <OnboardingForm
            firstName={payload?.given_name as string}
            lastName={payload?.family_name as string}
          />
        </CardContent>
      </Card>
    </main>
  );
}
