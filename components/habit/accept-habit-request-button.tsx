"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Check } from "lucide-react";
import { revalidateHabits, revalidateMe } from "@/app/actions";

export default function AcceptHabitRequestButton({
  habitId,
}: {
  habitId: string;
}) {
  const { toast } = useToast();

  const handleClick = async () => {
    const res = await fetch(`${window.location.origin}/api/habits/accept`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ habitId }),
    });

    if (!res.ok) {
      return toast({
        variant: "destructive",
        title: "Something went wrong",
        description: "We're fixing this, Houston",
      });
    }

    await revalidateHabits();
    await revalidateMe();
    toast({
      title: "Success",
    });
  };
  return (
    <Button onClick={handleClick}>
      <Check />
    </Button>
  );
}
