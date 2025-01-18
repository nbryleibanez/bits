"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
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

export default function SkipHabitButton({
  userId,
  username,
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

  const handleSkip = () => {
    onAction(async () => {
      try {
        const res = await fetch(
          `${window.location.origin}/api/habits/${params.id}?type=${type}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ action: "skip" }),
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
      onClick={handleSkip}
      disabled={isLogged || isLoading || isOtherActionRunning}
      variant="outline"
    >
      {isLoading ? <LoadingSpinner /> : "Skip"}
    </Button>
  );
}
