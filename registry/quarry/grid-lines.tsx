import { cn } from "@/lib/utils";

/**
 * Faint vertical guide lines that run the full height of a section, like the columns of a layout
 * grid. They add structure without adding weight. Put it inside any relatively positioned box,
 * or set `position` to `fixed` to lay it over the whole page.
 */
export function GridLines({
  columns = 4,
  inset = "clamp(1rem, 3.2vw, 3rem)",
  position = "absolute",
  className,
}: {
  /** How many equal columns, which gives columns + 1 lines. */
  columns?: number;
  /** Space kept free at the left and right edges. */
  inset?: string;
  position?: "absolute" | "fixed";
  className?: string;
}) {
  return (
    <div aria-hidden className={cn("pointer-events-none inset-y-0 z-[3]", position, className)} style={{ left: inset, right: inset }}>
      {Array.from({ length: columns + 1 }, (_, i) => (
        <i
          key={i}
          className={cn("absolute inset-y-0 w-px bg-foreground/[0.09]", i > 0 && i < columns && i % 2 === 1 && "max-sm:hidden")}
          style={i === columns ? { right: 0 } : { left: `${(i / columns) * 100}%` }}
        />
      ))}
    </div>
  );
}
