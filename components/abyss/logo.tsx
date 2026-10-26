import { cn } from "@/lib/utils";

/** A ring with two swells under it. Replace with your own mark. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={cn("size-5", className)} aria-hidden>
      <circle cx="12" cy="9" r="5.2" />
      <path d="M3 17c2.2-1.7 4.4-1.7 6.6 0s4.4 1.7 6.6 0 3.2-1.2 4.8 0" />
      <path d="M3 21c2.2-1.7 4.4-1.7 6.6 0s4.4 1.7 6.6 0 3.2-1.2 4.8 0" opacity="0.5" />
    </svg>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 text-[15px] font-semibold tracking-tight text-foreground", className)}>
      <Mark /> Abyss
    </span>
  );
}
