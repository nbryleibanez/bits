"use client";

import { useRouter } from "next/navigation";
import {
  revalidateUser,
  revalidateHabitRequest,
  revalidateHabitRequests,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  habitId: string;
  ownerUsername: string;
  myUsername: string;
  myId: string;
  isLoading: boolean;
  isOtherActionRunning: boolean;
  onAction: (callback: () => Promise<void>) => void;
}

export default function DeclineButton({
  habitId,
  ownerUsername,
  myUsername,
  myId,
  isLoading,
  isOtherActionRunning,
  onAction,
}: Props) {
  const { toast } = useToast();
  const router = useRouter();

  const declineHabitRequest = () => {
    onAction(async () => {
      try {
        const res = await fetch(
          `${window.location.origin}/api/habits/decline`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ habitId }),
          },
        );

        if (!res.ok) throw Error;

        await revalidateUser(ownerUsername);
        await revalidateUser(myUsername);
        await revalidateHabitRequest(habitId);
        await revalidateHabitRequests(myId);

        router.push("/");
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
      variant="outline"
      className="w-full h-12"
      onClick={declineHabitRequest}
      disabled={isLoading || isOtherActionRunning}
    >
      {isLoading ? <LoadingSpinner /> : "Decline"}
    </Button>
  );
}
