"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  habitId: string;
  title: string;
  ownerId: string;
  ownerUsername: string;
  ownerFullName: string;
  ownerAvatarUrl: string;
  myId: string;
  myUsername: string;
  isLoading: boolean;
  isOtherActionRunning: boolean;
  onAction: (callback: () => Promise<void>) => void;
}

export default function AcceptButton({
  habitId,
  title,
  ownerId,
  ownerUsername,
  ownerFullName,
  ownerAvatarUrl,
  myId,
  myUsername,
  isLoading,
  isOtherActionRunning,
  onAction,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const acceptHabitRequest = () => {
    onAction(async () => {
      try {
        const res = await fetch(`${window.location.origin}/api/habits/accept`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            habitId,
            title,
            ownerId,
            ownerFullName,
            ownerAvatarUrl,
          }),
        });

        if (!res.ok) {
          throw new Error();
        }

        toast({
          title: "Habit Request Accepted",
          description: "You are now in a Duo Habit with this user.",
        });

        router.push(`/habit/${habitId}?=duo`);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Something went wrong.",
          description: "We're fixing this, Houston.",
        });
      }
    });
  };

  return (
    <Button
      className="w-full h-12"
      onClick={acceptHabitRequest}
      disabled={isLoading || isOtherActionRunning}
    >
      {isLoading ? <LoadingSpinner /> : "Accept"}
    </Button>
  );
}
