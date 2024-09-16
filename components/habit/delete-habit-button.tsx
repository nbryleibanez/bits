"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
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
} from "@/components/ui/alert-dialog"

export default function DeleteHabitButton() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true)

    const res = await fetch(`${window.location.origin}/api/habits/${params.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
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
      description: "Habit deleted.",
    });

    router.push("/")
    router.refresh()
  }

  return (
    <div className="w-full">
      <AlertDialog>
        <AlertDialogTrigger
          className="w-full"
          asChild
        >
          <Button disabled={isLoading} variant="outline" className="w-full h-12">
            {isLoading ? <LoadingSpinner /> : "Delete"}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete Habit
            </AlertDialogTitle>
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
  )
}
