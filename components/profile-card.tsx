import Link from "next/link";

export default function ProfileCard() {
  return (
    <Link
      href="/user"
      className="h-20 flex p-4 gap-4 bg-blue-500 rounded-xl text-white"
    >
      <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
      <div>
        <div>Juan Dela Cruz</div>
        <div>@juandelacruz</div>
      </div>
    </Link>
  );
}
