import Link from "next/link";
import BasicHabitForm from "@/components/habit/basic-habit-form"

import {
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

export default function Page() {
  return (
    <main className="relative flex flex-col min-h-screen items-center justify-center p-5 gap-4">
      <div className="absolute sm:relative left-5 top-5 sm:left-0 sm:top-0 w-full max-w-md">
        <Link className="w-fit h-fit" href="/create">
          <ArrowLeft className="h-8 w-8" />
        </Link>
      </div>
      <Card className="w-full max-w-md">
        <CardHeader>
          <div>
            <h1 className="text-xl font-semibold">Create Basic Habit</h1>
            <p className="text-gray-600">Remember: Make it easy.</p>
          </div>
        </CardHeader>
        <CardContent>
          <BasicHabitForm />
        </CardContent>
      </Card>
    </main >
  )
}
