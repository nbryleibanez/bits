import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <form action="/api/auth/sign-out" method="GET">
      <Button>Sign Out</Button>
    </form>
  );
}
