"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { revalidateHabits, revalidateUser } from "@/app/actions";

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
  myId,
  myUsername,
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

    await revalidateUser(ownerUsername);
    await revalidateUser(myUsername);
    await revalidateHabits(ownerId);
    await revalidateHabits(myId);

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
    if (!res.ok) {
      return toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "We're fixing it, Houston.",
      });
    }

    await revalidateUser(ownerUsername);
    await revalidateUser(myUsername);
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
