import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card"
import { ArrowLeft } from "lucide-react";

export default function CreatePage() {
  return (
    <main className="relative min-h-screen w-full p-5 flex flex-col justify-center items-center gap-4">
      <div className="absolute sm:relative left-5 top-5 sm:left-0 sm:top-0 w-full max-w-lg">
        <Link className="w-fit h-fit" href="/">
          <ArrowLeft className="h-8 w-8" />
        </Link>
      </div>
      <Card className="max-w-lg">
        <CardHeader>
          <h1 className="text-xl font-semibold">Habit type</h1>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            <Link href="/create/basic">
              <Button className="w-full h-fit p-4 flex flex-col items-start gap-2">
                <h2 className="text-xl font-medium">Basic Habit</h2>
                <p className="text-sm font-light whitespace-normal text-left">
                  A habit that is commonly used in habit-tracking applications.
                </p>
              </Button>
            </Link>
            <Link href="/create/cue">
              <Button className="w-full h-fit p-4 flex flex-col items-start gap-2">
                <h2 className="text-xl font-medium">Cue-Based Habit</h2>
                <p className="text-sm font-light whitespace-normal text-left">
                  A habit triggered by a context cue. Follows the literature around
                  habits.
                </p>
              </Button>
            </Link>
            <Link href="/create/duo">
              <Button className="w-full h-fit p-4 flex flex-col items-start gap-2">
                <h2 className="text-xl font-medium">Duo Habit</h2>
                <p className="text-sm font-light whitespace-normal text-left">Form a habit with a partner.</p>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
