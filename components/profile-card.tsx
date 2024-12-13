import Link from "next/link";
import { cookies } from "next/headers"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Settings, Users } from "lucide-react"
import { getUserMe } from "@/lib/fetch"

export default async function ProfileCard() {
  const cookieStore = await cookies()
  const data = await getUserMe(cookieStore)

  return (
    <div className="h-20 sm:h-full sm:w-fit flex sm:flex-col justify-between p-4 gap-4 sm:gap-12 bg-primary rounded-xl text-white" >
      <div className="flex items-center gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage src={data.avatar_url.S} />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div className="flex flex-col sm:hidden">
          <p className="text-sm font-semibold">{data.full_name.S}</p>
          <p className="text-sm">@{data.username.S}</p>
        </div>
      </div>
      <div className="flex items-center sm:flex-col gap-4 sm:gap-6">
        <Link href="/friends">
          <Users />
        </Link>
        <Link href="/user/me">
          <Settings />
        </Link>
      </div>
    </div>
  );
}
