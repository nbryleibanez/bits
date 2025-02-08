"use client";

import { useRouter } from "next/navigation";
import { useParams, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  userId: string;
  username: string;
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
  const searchParams = useSearchParams();
  const router = useRouter();
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

        router.refresh();
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
