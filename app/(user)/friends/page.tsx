import Link from "next/link";
import { cookies } from "next/headers";
import { getUserMe } from "@/lib/fetch";

import SearchBar from "@/components/friends/search-bar";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { ArrowLeft, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Friends",
};

export default async function FriendsPage() {
  const cookieStore = await cookies();
  const data = await getUserMe(cookieStore);

  return (
    <main className="min-h-screen p-5 flex flex-col items-center sm:justify-center gap-4">
      <div className="w-full max-w-md">
        <Link href="/" className="cursor-pointer">
          <ArrowLeft className="w-8 h-8" />
        </Link>
      </div>
      <SearchBar />
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-semibold">Friend Requests</h1>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {data.friend_requests.L.length ? (
              data.friend_requests?.L.map((request: any, index: number) => (
                <div
                  key={request.M.user_id.S}
                  className="flex flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={request.M.avatar_url.S}
                        alt={request.M.full_name.S}
                      />
                      <AvatarFallback>
                        {request.M.full_name.S[0]}
                      </AvatarFallback>
                    </Avatar>
                    <p>{request.M.full_name.S}</p>
                  </div>
                  <Link href={`/user/${request.M.username.S}`}>
                    <ChevronRight />
                  </Link>
                </div>
              ))
            ) : (
              <p>No Friend Requests.</p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-semibold">Friends</h1>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {data.friends.L.length ? (
              data.friends.L.map((f: any) => (
                <div
                  key={f.M.user_id.S}
                  className="flex flex-row items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={f.M.avatar_url.S}
                          alt={f.M.full_name.S}
                        />
                        <AvatarFallback>{f.M.full_name.S[0]}</AvatarFallback>
                      </Avatar>
                    </Avatar>
                    <p>{f.M.full_name.S}</p>
                  </div>
                  <Link href={`/user/${f.M.username.S}`}>
                    <ChevronRight />
                  </Link>
                </div>
              ))
            ) : (
              <p>No friends.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
