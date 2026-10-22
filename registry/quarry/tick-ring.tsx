import { cn } from "@/lib/utils";

/**
 * The classic activity indicator: a ring of thin ticks fading out behind a bright head. It turns in
 * steps, one tick at a time, so it stays sharp even when it spins fast.
 */
export function TickRing({
  size = 52,
  ticks = 12,
  duration = 0.8,
  className,
}: {
  size?: number;
  ticks?: number;
  /** Seconds per full turn. */
  duration?: number;
  className?: string;
}) {
  const w = Math.max(2, size * 0.07);
  const h = size * 0.26;
  return (
    <span role="status" aria-label="Loading" className={cn("relative inline-block text-foreground", className)} style={{ width: size, height: size }}>
      <span className="absolute inset-0 animate-spin" style={{ animationDuration: `${duration}s`, animationTimingFunction: `steps(${ticks})` }}>
        {Array.from({ length: ticks }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-0 rounded-full bg-current"
            style={{
              width: w,
              height: h,
              marginLeft: -w / 2,
              opacity: 0.1 + (i / (ticks - 1)) * 0.9,
              transform: `rotate(${(360 / ticks) * i}deg)`,
              transformOrigin: `50% ${size / 2}px`,
            }}
          />
        ))}
      </span>
    </span>
  );
}
