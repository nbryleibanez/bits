import AddFriendForm from "@/components/friends/add-friend-form";

import {
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";

export const metadata = {
  title: 'Friends'
}

export default function FriendsPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <AddFriendForm />
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Friend Requests</h1>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            <div>
              <p>Nhyl Ibanez</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Friends</h1>
        </CardHeader>
        <CardContent>
        </CardContent>
      </Card>
    </main>
  )
}
