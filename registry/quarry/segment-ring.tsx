import { cn } from "@/lib/utils";

/**
 * A donut cut into segments that fade behind a bright head, turning in steps. Bolder than the tick
 * ring, so it holds up at larger sizes.
 */
export function SegmentRing({
  size = 52,
  segments = 8,
  duration = 0.8,
  className,
}: {
  size?: number;
  segments?: number;
  /** Seconds per full turn. */
  duration?: number;
  className?: string;
}) {
  const r1 = 22;
  const r0 = 13;
  const gap = 0.12;
  const step = (Math.PI * 2) / segments;
  const pt = (r: number, a: number) => `${(24 + r * Math.sin(a)).toFixed(2)} ${(24 - r * Math.cos(a)).toFixed(2)}`;

  return (
    <span role="status" aria-label="Loading" className={cn("relative inline-block text-foreground", className)} style={{ width: size, height: size }}>
      <svg viewBox="0 0 48 48" className="absolute inset-0 animate-spin" style={{ animationDuration: `${duration}s`, animationTimingFunction: `steps(${segments})` }}>
        {Array.from({ length: segments }).map((_, i) => {
          const a0 = i * step + gap;
          const a1 = (i + 1) * step - gap;
          const d = `M${pt(r1, a0)} A${r1} ${r1} 0 0 1 ${pt(r1, a1)} L${pt(r0, a1)} A${r0} ${r0} 0 0 0 ${pt(r0, a0)} Z`;
          return <path key={i} d={d} fill="currentColor" opacity={0.12 + (i / (segments - 1)) * 0.88} />;
        })}
      </svg>
    </span>
  );
}
