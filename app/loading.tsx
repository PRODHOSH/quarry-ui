import { Skeleton } from "@/components/ui/skeleton";

/** Shown inside the page frame while a route loads, so the sidebar never blinks. */
export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl" role="status" aria-label="Loading">
      <Skeleton className="h-12 w-72 rounded-xl" />
      <Skeleton className="mt-5 h-4 w-full max-w-xl" />
      <Skeleton className="mt-2 h-4 w-2/3 max-w-md" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="aspect-[16/10] w-full rounded-xl" />
            <Skeleton className="mt-3 h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
