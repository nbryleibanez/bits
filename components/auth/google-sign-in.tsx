"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function GoogleSignIn() {
  const handleGoogleSignIn = () => {
    window.location.href = `${window.location.origin}/api/auth/google-sign-in`;
  }

  return (
    <Button
      onClick={handleGoogleSignIn}
      variant="outline"
      className="w-full"
    >
      Sign In With Google
    </Button>
  );
}
