import { cookies } from 'next/headers'
import DuoHabitForm from '@/components/habit/duo-habit-form'

import {
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";

export default async function Page() {
  const res = await fetch(`${process.env.SITE}/api/users/me`, {
    method: 'GET',
    headers: {
      "Content-Type": "application/json",
      "Cookie": (await cookies()).toString()
    }
  })
  const { Item } = await res.json()

  return (
    <main className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div>
            <h1 className="text-xl font-semibold">Create Duo Habit</h1>
            <p className="text-gray-600">Remember: Make it easy.</p>
          </div>
        </CardHeader>
        <CardContent>
          <DuoHabitForm Item={Item} />
        </CardContent>
      </Card>
    </main>
  )
}
