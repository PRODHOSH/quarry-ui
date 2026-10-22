"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

const IMAGES = [1015, 1016, 1018, 1019, 1020, 1021, 1022, 1024, 1025, 1026, 1027, 1031, 1035, 1036, 1037, 1038].map((id, i) => ({
  src: `https://picsum.photos/id/${id}/600/${i % 3 === 0 ? 800 : i % 3 === 1 ? 700 : 900}`,
  h: i % 3 === 0 ? "aspect-[3/4]" : i % 3 === 1 ? "aspect-[6/7]" : "aspect-[2/3]",
}));

function Column({ items, y, className }: { items: typeof IMAGES; y: MotionValue<string>; className?: string }) {
  return (
    <motion.div style={{ y }} className={cn("flex w-1/4 min-w-[9rem] flex-col gap-4", className)}>
      {[...items, ...items].map((im, i) => (
        <div key={i} className={cn("w-full flex-none overflow-hidden rounded-2xl border bg-muted", im.h)}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={im.src} alt="" loading="lazy" draggable={false} className="size-full object-cover" />
        </div>
      ))}
    </motion.div>
  );
}

/**
 * Four columns of photos that slide at different speeds as the page scrolls, so the wall seems to
 * move in layers. Pass `container` (a ref to a scrollable element) when it lives inside a scroll
 * area instead of the page.
 */
export function ParallaxGallery({ images = IMAGES, container, height = "70vh", className }: { images?: typeof IMAGES; container?: RefObject<HTMLElement | null>; height?: string; className?: string }) {
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, container, offset: ["start end", "end start"] });
  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const y2 = useTransform(scrollYProgress, [0, 1], ["-18%", "6%"]);
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);
  const y4 = useTransform(scrollYProgress, [0, 1], ["-24%", "2%"]);
  const cols = [0, 1, 2, 3].map((c) => images.filter((_, i) => i % 4 === c));

  return (
    <div ref={stage} style={{ height }} className={cn("relative flex w-full gap-4 overflow-hidden bg-background px-4", className)}>
      <Column items={cols[0]} y={y1} />
      <Column items={cols[1]} y={y2} />
      <Column items={cols[2]} y={y3} className="hidden sm:flex" />
      <Column items={cols[3]} y={y4} className="hidden md:flex" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}
