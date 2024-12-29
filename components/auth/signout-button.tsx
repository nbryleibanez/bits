import { Button } from "@/components/ui/button";

export default function SignOutButton() {
  return (
    <form className="w-full mt-auto" action="/api/auth/sign-out" method="GET">
      <Button className="w-full h-12 rounded-xl">Sign Out</Button>
    </form>
  );
}
