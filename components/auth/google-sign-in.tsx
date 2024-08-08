import { Button } from "@/components/ui/button";

export default function GoogleSignIn() {
  return (
    <form action="api/auth/google-sign-in" method="GET">
      <Button variant="outline" className="w-full rounded-xl">
        Sign In With Google
      </Button>
    </form>
  );
}
