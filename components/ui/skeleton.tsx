import { cn } from "@/lib/utils";

/** A quiet placeholder block shown while something loads. Size it with className. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("animate-pulse rounded-md bg-muted/70", className)} />;
}
