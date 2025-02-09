import GoogleSignIn from "@/components/auth/google-sign-in";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function MinimalistLogin() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900">Bits</h1>
          <p className="mt-2 text-sm text-gray-600">
            Habit-tracking reimagined
          </p>
        </div>

        <Card className="bg-white shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Sign In
            </CardTitle>
            <CardDescription className="text-center">
              Continue your journey to better habits
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleSignIn />
          </CardContent>
        </Card>

        <div className="mt-8 text-sm text-gray-600 text-center">
          <p>
            Bits is a thesis project investigating the effectiveness of various
            habit formation methods.
          </p>
          <p className="mt-2">
            By using our app, you&apos;re contributing to valuable research on
            habit building.
          </p>
        </div>
      </div>
    </div>
  );
}
