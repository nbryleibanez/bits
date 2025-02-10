"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface Props {
  sourceUserId: string;
  sourceUsername: string;
  sourceFullName: string;
  sourceAvatarUrl: string;
  targetUserId: string;
  targetUsername: string;
  targetFullName: string;
  targetAvatarUrl: string;
  index: number;
}

export default function AcceptRequestButton({
  sourceUserId,
  sourceFullName,
  sourceAvatarUrl,
  sourceUsername,
  targetUserId,
  targetFullName,
  targetAvatarUrl,
  targetUsername,
  index,
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleAddFriend = async () => {
    setIsLoading(true);

    try {
      const res = await fetch(`${window.location.origin}/api/friends/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sourceUserId,
          sourceFullName,
          sourceAvatarUrl,
          sourceUsername,
          targetUserId,
          targetFullName,
          targetUsername,
          targetAvatarUrl,
          index,
        }),
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
      disabled={isLoading}
    >
      {isLoading ? <LoadingSpinner /> : "Accept"}
    </Button>
  );
}
