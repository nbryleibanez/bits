"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { revalidateHabit, revalidateHabits, revalidateMe } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  isLogged: boolean;
  isLoading: boolean;
  isOtherActionRunning: boolean;
  onAction: (callback: () => Promise<void>) => void;
}

export default function LogHabitButton({
  isLogged,
  isLoading,
  isOtherActionRunning,
  onAction,
}: Props) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const type = searchParams.get("type");

  const handleLog = () => {
    onAction(async () => {
      try {
        const res = await fetch(
          `${window.location.origin}/api/habits/${params.id}?type=${type}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "log" }),
          },
        );

        if (!res.ok) {
          throw new Error("Failed to log habit");
        }

        await revalidateHabits();
        await revalidateMe();
        await revalidateHabit(params.id as string);
        // router.refresh();
      } catch (error) {
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
      onClick={handleLog}
      disabled={isLogged || isLoading || isOtherActionRunning}
    >
      {isLoading ? <LoadingSpinner /> : "Log Habit"}
    </Button>
  );
}
