import Link from "next/link";
import NavBar from "@/components/nav-bar";

export default function CreatePage() {
  return (
    <main>
      <h1>Choose a type of habit.</h1>
      <div>
        <Link href="/create/basic">
          <h2 className="text-xl font-medium">Basic Habit</h2>
          <p>A habit that is commonly used in habit-tracking applications.</p>
        </Link>
        <Link href="/create/cue">
          <h2 className="text-xl font-medium">Cue-Based Habit</h2>
          <p>
            A habit triggered by a context cue. Follows the literature around
            habits.
          </p>
        </Link>
        <Link href="/create/duo">
          <h2 className="text-xl font-medium">Duo Habit</h2>
          <p>Form a habit with a partner.</p>
        </Link>
      </div>
      <NavBar />
    </main>
  );
}
