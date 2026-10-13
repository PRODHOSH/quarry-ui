"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type CarouselSlide = { src: string; title: string; caption?: string };

const photo = (id: number) => `https://picsum.photos/id/${id}/800/1000`;
const DEFAULT_SLIDES: CarouselSlide[] = [
  { src: photo(1018), title: "High pasture", caption: "Valley road at dawn" },
  { src: photo(1039), title: "Hidden falls", caption: "Cold water, warm moss" },
  { src: photo(1015), title: "Fjord light", caption: "Where the water turns blue" },
  { src: photo(1043), title: "Granite wall", caption: "Two hours from the trail head" },
  { src: photo(1036), title: "First snow", caption: "A quiet camp" },
];

/**
 * A 3D coverflow. The centre slide faces you, its neighbours turn away and recede. Click a side slide,
 * use the arrows, drag, or press the arrow keys. It advances on its own until you touch it.
 */
export function PerspectiveCarousel({
  slides = DEFAULT_SLIDES,
  autoplay = true,
  interval = 3800,
  className,
}: {
  slides?: CarouselSlide[];
  autoplay?: boolean;
  interval?: number;
  className?: string;
}) {
  const n = slides.length;
  const [index, setIndex] = useState(Math.floor(n / 2));
  const [auto, setAuto] = useState(autoplay);

  useEffect(() => {
    if (!auto) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % n), interval);
    return () => window.clearInterval(id);
  }, [auto, interval, n]);

  const go = (to: number) => {
    setAuto(false);
    setIndex(((to % n) + n) % n);
  };

  return (
    <div
      className={cn("w-full px-4 py-10 outline-none", className)}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight") go(index + 1);
        if (e.key === "ArrowLeft") go(index - 1);
      }}
    >
      <motion.div
        className="relative mx-auto h-[26rem] w-full max-w-4xl [perspective:1400px]"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_, info) => {
          if (info.offset.x < -60) go(index + 1);
          else if (info.offset.x > 60) go(index - 1);
        }}
      >
        {slides.map((s, i) => {
          let d = i - index;
          if (d > n / 2) d -= n;
          if (d < -n / 2) d += n;
          const abs = Math.abs(d);
          return (
            <motion.figure
              key={s.src}
              onClick={() => d !== 0 && go(i)}
              animate={{
                x: `${d * 62}%`,
                z: -abs * 140,
                rotateY: d === 0 ? 0 : d > 0 ? -38 : 38,
                scale: d === 0 ? 1 : 0.86,
                opacity: abs > 2 ? 0 : 1 - abs * 0.22,
              }}
              transition={{ type: "spring", stiffness: 160, damping: 24 }}
              style={{ zIndex: 10 - abs, pointerEvents: abs > 2 ? "none" : "auto" }}
              className={cn("absolute inset-y-0 left-1/2 -ml-[9.5rem] w-[19rem] overflow-hidden rounded-3xl border bg-card shadow-2xl", d !== 0 && "cursor-pointer")}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={s.src} alt={s.title} draggable={false} loading="lazy" className="size-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent" />
              <figcaption className="absolute inset-x-5 bottom-5 text-white">
                <p className="text-lg font-medium tracking-tight">{s.title}</p>
                {s.caption && <p className="mt-0.5 text-xs text-white/70">{s.caption}</p>}
              </figcaption>
            </motion.figure>
          );
        })}
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button type="button" aria-label="Previous" onClick={() => go(index - 1)} className="grid size-10 place-items-center rounded-full border bg-card transition-colors hover:bg-accent">
          <ChevronLeft className="size-4" />
        </button>
        <div className="flex items-center gap-1.5">
          {slides.map((s, i) => (
            <button key={s.src} type="button" aria-label={`Go to ${s.title}`} onClick={() => go(i)} className={cn("h-1.5 rounded-full transition-all duration-500", i === index ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-muted-foreground")} />
          ))}
        </div>
        <button type="button" aria-label="Next" onClick={() => go(index + 1)} className="grid size-10 place-items-center rounded-full border bg-card transition-colors hover:bg-accent">
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  );
}
