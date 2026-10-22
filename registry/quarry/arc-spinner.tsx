import { cn } from "@/lib/utils";

/**
 * A ring whose tail fades out smoothly behind a round head, spinning at constant speed. Thickness
 * and speed are props, and the colour follows `currentColor`.
 */
export function ArcSpinner({
  size = 52,
  thickness = 5,
  duration = 0.7,
  className,
}: {
  size?: number;
  thickness?: number;
  /** Seconds per full turn. */
  duration?: number;
  className?: string;
}) {
  const ring = `radial-gradient(farthest-side, transparent calc(100% - ${thickness}px), #000 calc(100% - ${thickness - 0.5}px))`;
  return (
    <span role="status" aria-label="Loading" className={cn("relative inline-block text-foreground", className)} style={{ width: size, height: size }}>
      <span className="absolute inset-0 animate-spin" style={{ animationDuration: `${duration}s`, animationTimingFunction: "linear" }}>
        <span
          className="absolute inset-0 rounded-full"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, transparent 8%, currentColor 100%)",
            WebkitMask: ring,
            mask: ring,
          }}
        />
        <span className="absolute left-1/2 top-0 rounded-full bg-current" style={{ width: thickness, height: thickness, marginLeft: -thickness / 2 }} />
      </span>
    </span>
  );
}
