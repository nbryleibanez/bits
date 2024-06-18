import Link from "next/link";

export default function ProfileCard() {
  return (
    <Link href="/user" className="bg-blue-500 flex">
      <div></div>
      <div>
        <div>Juan Dela Cruz</div>
        <div>@juandelacruz</div>
      </div>
    </Link>
  );
}
