import Link from "next/link";

export default function NavBar() {
  return (
    <div>
      <Link href="/">Home</Link>
      <Link href="/create">Create</Link>
      <Link href="/friends">Friends</Link>
    </div>
  );
}
