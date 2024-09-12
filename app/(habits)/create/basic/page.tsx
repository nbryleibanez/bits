import BasicHabitForm from "@/components/habit/basic-habit-form"

import {
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";

export default function Page() {
  return (
    <main className="flex min-h-screen items-center justify-center">
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
    </main>
  )
}
