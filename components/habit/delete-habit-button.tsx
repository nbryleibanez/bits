"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Props {
  userId: string;
  username: string;
  owner: string;
  isLoading: boolean;
  isOtherActionRunning: boolean;
  onAction: (callback: () => Promise<void>) => void;
}

export default function DeleteHabitButton({
  userId,
  username,
  owner,
  isLoading,
  isOtherActionRunning,
  onAction,
}: Props) {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const type = searchParams.get("type");

  const handleDelete = () => {
    onAction(async () => {
      try {
        const res = await fetch(
          `${window.location.origin}/api/habits/${params.id}?type=${type}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ owner }),
          },
        );
        if (!res.ok) {
          throw new Error("Failed to delete habit");
        }
        router.push("/");
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
    <div className="w-full">
      <AlertDialog>
        <AlertDialogTrigger className="w-full" asChild>
          <Button
            disabled={isLoading || isOtherActionRunning}
            variant="outline"
            className="w-full h-12"
          >
            {isLoading ? <LoadingSpinner /> : "Delete"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Habit</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this habit?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
