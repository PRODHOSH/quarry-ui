"use client";

import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { MoveHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A draggable before and after comparison. Pass any two nodes: images, screenshots, or live UI.
 * Works with a mouse, touch and the arrow keys.
 */
export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  initial = 50,
  className,
}: {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  /** Starting position, as a percentage from the left. */
  initial?: number;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(initial);
  const [dragging, setDragging] = useState(false);

  const move = useCallback((clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    move(e.clientX);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") setPos((p) => Math.max(0, p - step));
    else if (e.key === "ArrowRight") setPos((p) => Math.min(100, p + step));
    else return;
    e.preventDefault();
  };

  return (
    <div
      ref={box}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => dragging && move(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      className={cn("relative aspect-[16/10] w-full touch-pan-y select-none overflow-hidden rounded-3xl border bg-card", className)}
    >
      <div className="absolute inset-0">{after}</div>
      <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-primary-foreground">
        {afterLabel}
      </span>

      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {before}
        <span className="absolute left-4 top-4 rounded-full bg-foreground/80 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-background">
          {beforeLabel}
        </span>
      </div>

      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparison position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos)}
        onKeyDown={onKeyDown}
        className="group absolute inset-y-0 z-10 w-px cursor-ew-resize bg-background outline-none"
        style={{ left: `${pos}%` }}
      >
        <span
          className={cn(
            "absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border bg-background text-foreground shadow-lg transition-transform duration-300 group-focus-visible:ring-4 group-focus-visible:ring-ring/30",
            dragging ? "scale-110" : "group-hover:scale-105"
          )}
        >
          <MoveHorizontal className="size-4" />
        </span>
      </div>
    </div>
  );
}
