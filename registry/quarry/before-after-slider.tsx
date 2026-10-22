"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useInView, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const PHOTO = "https://picsum.photos/id/1018/1600/1000";

/**
 * A draggable before and after comparison. By default it shows one photo twice, flat and black and
 * white on the left, full colour on the right. Pass `beforeSrc` and `afterSrc` for your own images,
 * or `before` and `after` for any nodes (screenshots, live UI). The handle follows the pointer with
 * a spring, nudges once to hint it can move, and works with touch and the arrow keys.
 */
export function BeforeAfterSlider({
  beforeSrc = PHOTO,
  afterSrc = PHOTO,
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  initial = 50,
  className,
}: {
  /** Image for the left side. Ignored when `before` is given. */
  beforeSrc?: string;
  /** Image for the right side. Ignored when `after` is given. */
  afterSrc?: string;
  before?: ReactNode;
  after?: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  /** Starting position, as a percentage from the left. */
  initial?: number;
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const inView = useInView(box, { once: true, amount: 0.6 });
  const [dragging, setDragging] = useState(false);
  const [touched, setTouched] = useState(false);

  const target = useMotionValue(initial);
  const pos = useSpring(target, { stiffness: 380, damping: 42, mass: 0.6 });
  const clip = useMotionTemplate`inset(0 ${useTransform(pos, (v) => 100 - v)}% 0 0)`;
  const left = useTransform(pos, (v) => `${v}%`);
  const [now, setNow] = useState(initial);
  useEffect(() => pos.on("change", (v) => setNow(Math.round(v))), [pos]);

  // one small nudge the first time it scrolls into view, so people know it moves
  useEffect(() => {
    if (!inView || touched) return;
    const c = animate(target, [initial, initial - 14, initial + 8, initial], { duration: 1.8, delay: 0.5, ease: "easeInOut" });
    return () => c.stop();
  }, [inView, touched, initial, target]);

  const move = (clientX: number) => {
    const el = box.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    target.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setTouched(true);
    move(e.clientX);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 2;
    if (e.key === "ArrowLeft") target.set(Math.max(0, target.get() - step));
    else if (e.key === "ArrowRight") target.set(Math.min(100, target.get() + step));
    else return;
    setTouched(true);
    e.preventDefault();
  };

  const img = (src: string, flat: boolean) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" draggable={false} className={cn("size-full object-cover", flat && "grayscale contrast-[0.92] brightness-[0.92]")} />
  );

  return (
    <div
      ref={box}
      onPointerDown={onPointerDown}
      onPointerMove={(e) => dragging && move(e.clientX)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
      className={cn("relative mx-auto aspect-[16/10] w-full max-w-2xl touch-pan-y select-none overflow-hidden rounded-2xl border bg-muted", className)}
    >
      <div className="absolute inset-0">{after ?? img(afterSrc, false)}</div>
      <span className="absolute right-3 top-3 rounded-full bg-background/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-foreground backdrop-blur">
        {afterLabel}
      </span>

      <motion.div className="absolute inset-0" style={{ clipPath: clip }}>
        {before ?? img(beforeSrc, true)}
        <span className="absolute left-3 top-3 rounded-full bg-foreground/85 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-background backdrop-blur">
          {beforeLabel}
        </span>
      </motion.div>

      <motion.div
        role="slider"
        tabIndex={0}
        aria-label="Comparison position"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={now}
        onKeyDown={onKeyDown}
        style={{ left }}
        className="group absolute inset-y-0 z-10 w-0.5 -translate-x-1/2 cursor-ew-resize bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.25)] outline-none"
      >
        <span
          className={cn(
            "absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-[0_6px_24px_rgba(0,0,0,0.35)] transition-transform duration-200 group-focus-visible:ring-4 group-focus-visible:ring-white/40",
            dragging ? "scale-110" : "group-hover:scale-105"
          )}
        >
          <ChevronLeft className="-mr-1 size-4" />
          <ChevronRight className="-ml-1 size-4" />
        </span>
      </motion.div>

      <AnimatePresence>
        {!touched && (
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ delay: 0.8 }}
            className="pointer-events-none absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/85 px-3 py-1 text-[11px] text-muted-foreground backdrop-blur"
          >
            Drag to compare
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}
