"use client"

import { useParams, useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
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

  const handleDelete = async () => {
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
        <AlertDialogTrigger className="w-full">
          <Button variant="outline" className="w-full h-12">Delete</Button>
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
