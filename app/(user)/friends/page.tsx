import { cookies } from 'next/headers';
import { verifyToken } from '@/utils/verify-token';
import AddFriendForm from "@/components/friends/add-friend-form";

import {
  Avatar,
  AvatarImage,
  AvatarFallback
} from "@/components/ui/avatar";
import {
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";

export const metadata = {
  title: 'Friends'
}

export default async function FriendsPage() {
  const idToken = cookies().get('id_token')?.value as string
  const payload = await verifyToken(idToken, "id") as unknown as string

  const res = await fetch(`${process.env.SITE}/api/users/${payload.sub}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies().toString()
    }
  })

  const { Item } = await res.json()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <AddFriendForm token={payload} />
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Friend Requests</h1>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            {
              Item.friend_requests?.L.map((request: any, index: number) => (
                <div key={request.M.user_id.S} className="flex flex-row items-center justify-between gap-4">
                  <Avatar>
                    <AvatarImage src={request.M.avatar_url.S} alt={request.M.full_name.S} />
                    <AvatarFallback>
                      {request.M.full_name.S[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p>{request.M.full_name.S}</p>
                  <button>Accept</button>
                  <button>Decline</button>
                </div>
              ))
            }
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
