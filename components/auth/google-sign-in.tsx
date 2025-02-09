"use client";

import { Button } from "@/components/ui/button";
import { Chrome } from "lucide-react";

export default function GoogleSignIn() {
  const handleGoogleSignIn = () => {
    window.location.href = `${window.location.origin}/api/auth/google-sign-in`;
  };

  return (
    <Button onClick={handleGoogleSignIn} variant="outline" className="w-full">
      <Chrome className="w-5 h-5 mr-2" />
      Sign in with Google
    </Button>
  );
}
