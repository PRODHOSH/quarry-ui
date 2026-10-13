"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Photo = { id: string; src: string; alt: string; ratio: number };

const PHOTOS: Photo[] = [
  { id: "a", src: "https://picsum.photos/seed/quarry-a/800/1000", alt: "Quiet street at dawn", ratio: 1.25 },
  { id: "b", src: "https://picsum.photos/seed/quarry-b/800/600", alt: "Coastline in soft light", ratio: 0.75 },
  { id: "c", src: "https://picsum.photos/seed/quarry-c/800/800", alt: "Mountain ridge", ratio: 1 },
  { id: "d", src: "https://picsum.photos/seed/quarry-d/800/1100", alt: "Forest path", ratio: 1.375 },
  { id: "e", src: "https://picsum.photos/seed/quarry-e/800/600", alt: "City from above", ratio: 0.75 },
  { id: "f", src: "https://picsum.photos/seed/quarry-f/800/900", alt: "Still water", ratio: 1.125 },
];

/**
 * A masonry gallery with a shared-element lightbox. Clicking a photo grows it out of its slot into
 * a full view, with arrow keys, swipe free navigation and Escape to close.
 */
export function LightboxGallery({ photos = PHOTOS, className }: { photos?: Photo[]; className?: string }) {
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpen((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, photos.length]);

  const current = open === null ? null : photos[open];

  return (
    <div className={cn("mx-auto w-full max-w-3xl", className)}>
      <div className="columns-2 gap-3 sm:columns-3 [&>*]:mb-3">
        {photos.map((p, i) => (
          <motion.button
            key={p.id}
            layoutId={`photo-${p.id}`}
            onClick={() => setOpen(i)}
            style={{ aspectRatio: `1 / ${p.ratio}` }}
            className="group relative block w-full cursor-zoom-in overflow-hidden rounded-xl bg-muted"
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={p.src} alt={p.alt} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 text-left text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">{p.alt}</span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {current && (
          <motion.div
            key="lb"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 grid place-items-center bg-background/85 p-6 backdrop-blur-md"
            onClick={() => setOpen(null)}
          >
            <motion.div
              layoutId={`photo-${current.id}`}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-h-[82vh] w-full max-w-xl overflow-hidden rounded-2xl bg-muted shadow-2xl"
              style={{ aspectRatio: `1 / ${Math.min(current.ratio, 1.15)}` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={current.src} alt={current.alt} className="size-full object-cover" />
              <p className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-sm text-white">{current.alt}</p>
            </motion.div>

            {[{ d: -1, Icon: ChevronLeft, pos: "left-4" }, { d: 1, Icon: ChevronRight, pos: "right-4" }].map(({ d, Icon, pos }) => (
              <button
                key={d}
                aria-label={d < 0 ? "Previous photo" : "Next photo"}
                onClick={(e) => { e.stopPropagation(); setOpen((i) => ((i ?? 0) + d + photos.length) % photos.length); }}
                className={cn("absolute top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full border bg-card/80 transition-colors hover:bg-card", pos)}
              >
                <Icon className="size-5" />
              </button>
            ))}
            <button onClick={() => setOpen(null)} aria-label="Close" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border bg-card/80 transition-colors hover:bg-card">
              <X className="size-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
