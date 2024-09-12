"use client"

import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "@radix-ui/react-icons";

import { useToast } from "@/components/ui/use-toast";

interface Props {
  streak: number;
  isLogged: boolean;
}

export default function LogHabitButton({ streak, isLogged }: Props) {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();

  const handleLog = async () => {
    const res = await fetch(`${window.location.origin}/api/habits/${params.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ streak: streak, isLogged: isLogged })
    });

    if (!res.ok) {
      toast({
        variant: "destructive",
        title: "Something went wrong.",
        description: "We're fixing this, Houston.",
      });
      return;
    }
    toast({
      title: "Success",
      description: "Habit logged.",
    });

    router.refresh()
  }
  return (
    <Button
      className="w-full h-12"
      onClick={handleLog}
      disabled={isLogged}
    >
      <CheckIcon />
    </Button>
  )

}
