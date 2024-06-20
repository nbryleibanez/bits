import Link from "next/link";

import { PlusIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";

export default function NavBar() {
  return (
    <div className="absolute bottom-6 w-full flex justify-center">
      <div className="h-16 w-fit px-3 py-2 flex gap-6 bg-white rounded-full">
        <Link
          className="h-12 w-12 flex justify-center items-center bg-background rounded-full"
          href="/"
        >
          <HomeIcon className="h-7 w-7" color="#999999" />
        </Link>
        <Link
          className="h-12 w-12 flex justify-center items-center bg-background rounded-full"
          href="/create"
        >
          <PlusIcon className="h-7 w-7" color="#999999" />
        </Link>
        <Link
          className="h-12 w-12 flex justify-center items-center bg-background rounded-full"
          href="/friends"
        >
          <PersonIcon className="h-7 w-7" color="#999999" />
        </Link>
      </div>
    </div>
  );
}
