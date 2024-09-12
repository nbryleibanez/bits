import Link from "next/link";
import NavBar from "@/components/nav-bar";

export default function CreatePage() {
  return (
    <main className="p-5">
      <h1 className="font-semibold mb-4">Choose a type</h1>
      <div className="flex flex-col gap-4">
        <Link className="bg-white rounded-3xl px-8 py-6" href="/create/basic">
          <h2 className="text-xl font-medium">Basic Habit</h2>
          <p className="text-sm font-light">
            A habit that is commonly used in habit-tracking applications.
          </p>
        </Link>
        <Link className="bg-white rounded-3xl px-8 py-6" href="/create/cue">
          <h2 className="text-xl font-medium">Cue-Based Habit</h2>
          <p className="text-sm font-light">
            A habit triggered by a context cue. Follows the literature around
            habits.
          </p>
        </Link>
        <Link className="bg-white rounded-3xl px-8 py-6" href="/create/duo">
          <h2 className="text-xl font-medium">Duo Habit</h2>
          <p className="text-sm font-light">Form a habit with a partner.</p>
        </Link>
      </div>
      <NavBar />
    </main>
  );
}
