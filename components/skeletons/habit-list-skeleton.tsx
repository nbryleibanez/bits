import { Skeleton } from "@/components/ui/skeleton"

export default async function HabitListSkeleton() {

  return (
    <div className="h-fit w-full grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
      <Skeleton className="aspect-square" />
    </div>
  );
}
