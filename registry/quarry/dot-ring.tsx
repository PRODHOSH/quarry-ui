import { cn } from "@/lib/utils";

/**
 * A ring of dots that shrink and fade behind a bright head. The whole ring turns in discrete steps,
 * so the head hops from dot to dot, which reads as faster and crisper than a smooth spin.
 */
export function DotRing({
  size = 52,
  dots = 12,
  duration = 0.8,
  className,
}: {
  size?: number;
  dots?: number;
  /** Seconds per full turn. */
  duration?: number;
  className?: string;
}) {
  const dot = size * 0.16;
  return (
    <span role="status" aria-label="Loading" className={cn("relative inline-block text-foreground", className)} style={{ width: size, height: size }}>
      <span className="absolute inset-0 animate-spin" style={{ animationDuration: `${duration}s`, animationTimingFunction: `steps(${dots})` }}>
        {Array.from({ length: dots }).map((_, i) => {
          const t = i / (dots - 1);
          return (
            <span
              key={i}
              className="absolute left-1/2 top-1/2 rounded-full bg-current"
              style={{
                width: dot,
                height: dot,
                opacity: 0.12 + t * 0.88,
                marginLeft: -dot / 2,
                marginTop: -dot / 2,
                transform: `rotate(${(360 / dots) * i}deg) translateY(${-(size / 2 - dot / 2)}px) scale(${0.55 + t * 0.45})`,
              }}
            />
          );
        })}
      </span>
    </span>
  );
}
