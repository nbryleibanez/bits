import Link from "next/link";

import { PlusIcon, HomeIcon, PersonIcon } from "@radix-ui/react-icons";

export default function NavBar() {
  return (
    <div className="fixed bottom-6 mx-auto left-0 right-0 h-16 w-fit px-3 py-2 flex gap-6 bg-white rounded-full">
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
  );
}
