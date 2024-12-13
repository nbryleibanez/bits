import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { CheckIcon } from "@radix-ui/react-icons";

export default async function HabitDetailsCardSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-8 w-[200px]" />
          </div>
          <div className="flex flex-col gap-1">
            <p className="text-sm text-end">Streak</p>
            <Skeleton className="h-12 w-12" />
          </div>
        </div>
      </CardHeader>
      <Separator />
      <CardContent>
        <div className="flex flex-col gap-4 pt-4">
          <div className="text-sm">Participants</div>
          <div className="flex flex-col gap-3">
            <Skeleton className="h-8 w-[200px]" />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full h-12" >
          <CheckIcon />
        </Button>
        <Button variant="outline" className="w-full h-12">
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
