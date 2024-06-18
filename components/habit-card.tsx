import Link from "next/link";

interface Props {
  id: string;
}

export default function HabitCard({ id }: Props) {
  return (
    <Link href={`/habit/${id}`} className="w-36 h-36 p-4 bg-white rounded-3xl">
      <div className="w-full flex space-between">
        <div>
          <div className="text-red-600 text-3xl font-bold">226</div>
          <div className="text-xs">streak</div>
        </div>
        <div>photo</div>
      </div>
      <div>Learn a language</div>
    </Link>
  );
}
