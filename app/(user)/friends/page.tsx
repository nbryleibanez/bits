import Link from "next/link"
import { cookies } from 'next/headers';
import { getUserMe } from '@/lib/fetch'
import { verifyToken } from '@/utils/auth/tokens';

import AddFriendForm from "@/components/friends/add-friend-form";
import FriendRequestButtons from '@/components/friends/friend-request-buttons';

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardHeader, CardContent, Card, } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react'

export const metadata = {
  title: 'Friends'
}

export default async function FriendsPage() {
  const cookieStore = await cookies()
  const payload = await verifyToken(cookieStore.get('id_token')?.value as string, "id") as unknown as string
  const data = await getUserMe(cookieStore)

  return (
    <main className="min-h-screen p-5 flex flex-col items-center sm:justify-center gap-4">
      <div className='w-full max-w-md cursor-pointer'>
        <Link href="/">
          <ArrowLeft className='w-8 h-8' />
        </Link>
      </div>
      <AddFriendForm token={payload} />
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-2xl font-bold">Friend Requests</h1>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {
              data.friend_requests?.L.map((request: any, index: number) => (
                <div key={request.M.user_id.S} className="flex flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Avatar className='h-10 w-10'>
                      <AvatarImage src={request.M.avatar_url.S} alt={request.M.full_name.S} />
                      <AvatarFallback>
                        {request.M.full_name.S[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p>{request.M.full_name.S}</p>
                  </div>
                  <FriendRequestButtons
                    sourceUserId={data.user_id.S as string}
                    sourceUsername={data.username.S as string}
                    sourceFullName={data.full_name.S as string}
                    sourceAvatarUrl={data.avatar_url.S as string}
                    targetUserId={request.M.user_id.S as string}
                    targetUsername={request.M.username.S as string}
                    targetFullName={request.M.full_name.S as string}
                    targetAvatarUrl={request.M.avatar_url.S as string}
                    index={index}
                  />
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
          <div className="flex flex-col gap-2">
            {
              data.friends.L.map((f: any) => (
                <div key={f.M.user_id.S} className="flex flex-row items-center justify-between gap-4">
                  <Avatar className='h-10 w-10'>
                    <AvatarImage src={f.M.avatar_url.S} alt={f.M.full_name.S} />
                    <AvatarFallback>
                      {f.M.full_name.S[0]}
                    </AvatarFallback>
                  </Avatar>
                  <p>{f.M.full_name.S}</p>
                </div>
              ))
            }
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
