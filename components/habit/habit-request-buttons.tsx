"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons";

export default function HabitRequestButtons({
  index,
  habitId,
  type,
  title,
  ownerId,
  ownerUsername,
  ownerFullName,
  ownerAvatarUrl,
}: any) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const acceptHabitRequest = async () => {
    setLoading(true);
    const res = await fetch(`${window.location.origin}/api/habits/accept`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        index,
        habitId,
        type,
        title,
        ownerId,
        ownerFullName,
        ownerAvatarUrl,
      }),
    });

    setLoading(false);
    router.refresh();

    if (!res.ok) {
      return toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "We're fixing it, Houston.",
      });
    }

    toast({
      title: "Friend request accepted",
      description: "You are now friends with this user",
    });
    router.push(`/habit/${habitId}`);
  };

  const declineHabitRequest = async () => {
    setLoading(true);
    const res = await fetch(`${window.location.origin}/api/habits/decline`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ index }),
    });

    setLoading(false);
    router.refresh();
    if (!res.ok) {
      return toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "We're fixing it, Houston.",
      });
    }
  };

  return (
    <div className="flex justify-between">
      <Button
        variant="outline"
        className="h-10 w-10 rounded-full"
        onClick={acceptHabitRequest}
        disabled={loading}
      >
        <CheckIcon className="h-10 w-10" />
      </Button>
      <Button
        variant="outline"
        className="h-10 w-10 rounded-full"
        onClick={declineHabitRequest}
        disabled={loading}
      >
        <Cross2Icon />
      </Button>
    </div>
  );
}
