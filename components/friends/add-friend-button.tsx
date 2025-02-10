"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AddFriendButton({
  sourceUsername,
  targetUsername,
  isSentRequest,
}: {
  sourceUsername: string;
  targetUsername: string;
  isSentRequest: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddFriend = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${window.location.origin}/api/friends/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: targetUsername }),
      });

      if (!res.ok) throw new Error();

      setIsLoading(false);
      router.refresh();
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
      onClick={handleAddFriend}
      disabled={isLoading || isSentRequest}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : isSentRequest ? (
        "Already sent request"
      ) : (
        "Add Friend"
      )}
    </Button>
  );
}
