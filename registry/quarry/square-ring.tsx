import { cn } from "@/lib/utils";

/**
 * A ring of small squares that fade behind a bright head, turning in steps. A more technical cousin
 * of the dot ring.
 */
export function SquareRing({
  size = 52,
  squares = 12,
  duration = 0.9,
  className,
}: {
  size?: number;
  squares?: number;
  /** Seconds per full turn. */
  duration?: number;
  className?: string;
}) {
  const s = size * 0.15;
  return (
    <span role="status" aria-label="Loading" className={cn("relative inline-block text-foreground", className)} style={{ width: size, height: size }}>
      <span className="absolute inset-0 animate-spin" style={{ animationDuration: `${duration}s`, animationTimingFunction: `steps(${squares})` }}>
        {Array.from({ length: squares }).map((_, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-0 rounded-[2px] bg-current"
            style={{
              width: s,
              height: s,
              marginLeft: -s / 2,
              opacity: 0.1 + (i / (squares - 1)) * 0.9,
              transform: `rotate(${(360 / squares) * i}deg)`,
              transformOrigin: `50% ${size / 2}px`,
            }}
          />
        ))}
      </span>
    </span>
  );
}
