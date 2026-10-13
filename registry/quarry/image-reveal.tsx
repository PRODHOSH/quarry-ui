"use client";

import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

type Shot = { src: string; title: string; tag: string };

const SHOTS: Shot[] = [
  { src: "https://picsum.photos/seed/quarry-r1/900/1100", title: "Morning Light", tag: "Editorial" },
  { src: "https://picsum.photos/seed/quarry-r2/900/1100", title: "Open Space", tag: "Interior" },
  { src: "https://picsum.photos/seed/quarry-r3/900/1100", title: "Low Tide", tag: "Landscape" },
];

function Shot({ s, i }: { s: Shot; i: number }) {
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });
  const [hover, setHover] = useState(false);

  return (
    <figure ref={ref} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} className={cn("relative aspect-[4/5]", i === 1 && "sm:mt-8")}>
      <motion.div
        initial={false}
        animate={{ clipPath: seen ? "inset(0% 0 0 0 round 12px)" : "inset(100% 0 0 0 round 12px)" }}
        transition={{ duration: 0.9, delay: i * 0.14, ease: [0.76, 0, 0.24, 1] }}
        className="absolute inset-0 overflow-hidden bg-muted"
      >
        <motion.div initial={false} animate={{ scale: seen ? 1 : 1.25 }} transition={{ duration: 1.1, delay: i * 0.14, ease: [0.22, 1, 0.36, 1] }} className="size-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.src} alt={s.title} loading="lazy" className="size-full object-cover transition-transform duration-700 ease-out hover:scale-105" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
        <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between p-4 text-white">
          <motion.span animate={{ y: hover ? 0 : 6 }} className="text-lg font-medium tracking-tight">{s.title}</motion.span>
          <motion.span animate={{ opacity: hover ? 1 : 0, y: hover ? 0 : 6 }} className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] backdrop-blur">{s.tag}</motion.span>
        </figcaption>
      </motion.div>
    </figure>
  );
}

/**
 * Editorial image cards. Each image wipes in with a clip-path as it enters the viewport, staggered
 * left to right, then scales gently and reveals its tag on hover.
 */
export function ImageReveal({ shots = SHOTS, className }: { shots?: Shot[]; className?: string }) {
  return (
    <div className={cn("mx-auto grid w-full max-w-4xl gap-4 sm:grid-cols-3", className)}>
      {shots.map((s, i) => <Shot key={s.title} s={s} i={i} />)}
    </div>
  );
}
