"use client";

import { useState } from "react";
import { revalidateMe, revalidateUser } from "@/app/actions";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Props {
  sourceUserId: string;
  targetUserId: string;
  targetUsername: string;
}

export default function UnfriendButton({
  sourceUserId,
  targetUserId,
  targetUsername,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleUnfriend = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(
        `${window.location.origin}/api/friends/unfriend`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceUserId,
            targetUserId,
          }),
        },
      );

      if (!res.ok) throw new Error();

      await revalidateMe();
      await revalidateUser(targetUsername);
      setIsLoading(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "We're fixing this, Houston.",
      });
    }
  };

  return (
    <Button
      className="w-full h-12 mt-auto rounded-xl"
      onClick={handleUnfriend}
      disabled={isLoading}
    >
      {isLoading ? <LoadingSpinner /> : "Unfriend"}
    </Button>
  );
}
