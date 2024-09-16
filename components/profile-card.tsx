import Link from "next/link";
import { cookies } from "next/headers"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default async function ProfileCard() {
  let res = await fetch(`${process.env.SITE}/api/users/me`, {
    method: "GET",
    headers: {
      Cookie: cookies().toString(),
    },
    cache: "force-cache",
  })

  let { Item } = await res.json()

  return (
    <Link
      href="/user/me"
      className="h-20 md:h-full md:w-60 flex md:flex-col justify-between md:justify-start p-4 gap-4 md:gap-12 bg-primary rounded-xl text-white"
    >
      <div className="flex items-center">
        <h1 className="text-xl font-bold md:text-3xl">Home</h1>
      </div>
      <div className="flex md:flex-col gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={Item.avatar_url.S} />
          <AvatarFallback>S</AvatarFallback>
        </Avatar>
        <div>
          <div className="md:text-xl font-semibold">{Item.full_name.S}</div>
          <div className="md:text-xl">@{Item.username.S}</div>
        </div>
      </div>
    </Link>
  );
}
