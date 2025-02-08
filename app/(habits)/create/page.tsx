import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent, Card } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";

interface HabitTypeProps {
  href: string;
  title: string;
  description: string;
}

const HabitTypeButton: React.FC<HabitTypeProps> = ({
  href,
  title,
  description,
}) => (
  <Link href={href} className="w-full drop-shadow">
    <Button
      variant="outline"
      className="w-full h-fit p-4 flex flex-col items-start gap-2 rounded-xl"
    >
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-sm font-light whitespace-normal text-left">
        {description}
      </p>
    </Button>
  </Link>
);

const habitTypes = [
  {
    href: "/create/basic",
    title: "Basic Habit",
    description:
      "A habit that is commonly used in habit-tracking applications.",
  },
  {
    href: "/create/cue",
    title: "Cue-Based Habit",
    description:
      "A habit triggered by a context cue. Follows the literature around habits.",
  },
  {
    href: "/create/duo",
    title: "Duo Habit",
    description: "Form a habit with a partner.",
  },
];

export default function CreatePage() {
  return (
    <main className="min-h-dvh w-full p-5 flex flex-col sm:justify-center items-center gap-4">
      <div className="w-full max-w-lg">
        <Link className="w-fit h-fit" href="/">
          <ArrowLeft className="h-8 w-8" />
        </Link>
      </div>

      {/* Mobile view (up to sm breakpoint) */}
      <div className="w-full max-w-lg sm:hidden">
        <h1 className="text-2xl font-semibold mb-4">Habit type</h1>
        <div className="flex flex-col gap-4">
          {habitTypes.map((habit, index) => (
            <HabitTypeButton key={index} {...habit} />
          ))}
        </div>
      </div>

      {/* Desktop view (sm breakpoint and above) */}
      <Card className="max-w-lg hidden sm:block">
        <CardHeader>
          <h1 className="text-xl font-semibold">Habit type</h1>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {habitTypes.map((habit, index) => (
              <HabitTypeButton key={index} {...habit} />
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
