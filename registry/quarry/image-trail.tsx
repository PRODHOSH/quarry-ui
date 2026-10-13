"use client";

import { useRef, useState, type PointerEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const photo = (id: number) => `https://picsum.photos/id/${id}/400/500`;
const DEFAULT_IMAGES = [1015, 1018, 1036, 1039, 1043, 1062, 29, 15].map(photo);

type Drop = { id: number; x: number; y: number; src: string; rot: number };

/**
 * Move the pointer across the area and photos are dropped along its path, tilt a little, then fade away.
 * Put your own headline in children.
 */
export function ImageTrail({
  images = DEFAULT_IMAGES,
  distance = 90,
  size = 150,
  children,
  className,
}: {
  images?: string[];
  /** Pixels the pointer must travel before the next photo lands. */
  distance?: number;
  size?: number;
  children?: ReactNode;
  className?: string;
}) {
  const [drops, setDrops] = useState<Drop[]>([]);
  const last = useRef<{ x: number; y: number } | null>(null);
  const count = useRef(0);

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;
    if (last.current && Math.hypot(x - last.current.x, y - last.current.y) < distance) return;
    last.current = { x, y };
    const id = count.current++;
    const drop: Drop = { id, x, y, src: images[id % images.length], rot: (Math.random() - 0.5) * 18 };
    setDrops((d) => [...d.slice(-9), drop]);
    window.setTimeout(() => setDrops((d) => d.filter((item) => item.id !== id)), 1400);
  };

  return (
    <div onPointerMove={onMove} onPointerLeave={() => (last.current = null)} className={cn("relative grid min-h-[26rem] w-full place-items-center overflow-hidden", className)}>
      <div className="pointer-events-none relative z-10 px-6 text-center">
        {children ?? (
          <>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-muted-foreground">Move your cursor</p>
            <h2 className="mt-4 text-balance text-5xl font-medium leading-[1.02] tracking-tight sm:text-7xl">Leave a trail of places</h2>
          </>
        )}
      </div>
      <AnimatePresence>
        {drops.map((d) => (
          <motion.div
            key={d.id}
            initial={{ opacity: 0, scale: 0.6, rotate: d.rot * 2 }}
            animate={{ opacity: 1, scale: 1, rotate: d.rot }}
            exit={{ opacity: 0, scale: 0.85, y: 24 }}
            transition={{ duration: 0.45, ease: [0.32, 0.72, 0, 1] }}
            className="pointer-events-none absolute z-0 overflow-hidden rounded-2xl border shadow-2xl"
            style={{ left: d.x - size / 2, top: d.y - (size * 1.25) / 2, width: size, height: size * 1.25 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={d.src} alt="" draggable={false} className="size-full object-cover" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
