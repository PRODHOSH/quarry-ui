"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type GalleryImage = { src: string; title: string; label?: string };

const photo = (id: number) => `https://picsum.photos/id/${id}/900/1200`;
const DEFAULT_IMAGES: GalleryImage[] = [
  { src: photo(1015), title: "Fjord light", label: "01" },
  { src: photo(1018), title: "High pasture", label: "02" },
  { src: photo(1036), title: "First snow", label: "03" },
  { src: photo(1039), title: "Hidden falls", label: "04" },
  { src: photo(1043), title: "Granite wall", label: "05" },
  { src: photo(1062), title: "Open water", label: "06" },
];

/**
 * A row of tall image panels. The one you hover or focus grows, the rest give way, and its caption
 * slides up. On touch screens tap a panel to open it. Arrow keys move between panels.
 */
export function ExpandGallery({
  images = DEFAULT_IMAGES,
  height = 420,
  className,
}: {
  images?: GalleryImage[];
  height?: number;
  className?: string;
}) {
  const middle = Math.floor(images.length / 2);
  const [active, setActive] = useState(middle);

  return (
    <div className={cn("w-full px-6 py-10", className)}>
      <div className="mx-auto flex max-w-4xl gap-2 sm:gap-3" style={{ height }} onMouseLeave={() => setActive(middle)}>
        {images.map((img, i) => {
          const on = i === active;
          return (
            <motion.button
              key={img.src}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === "ArrowRight") setActive((a) => Math.min(images.length - 1, a + 1));
                if (e.key === "ArrowLeft") setActive((a) => Math.max(0, a - 1));
              }}
              animate={{ flexGrow: on ? 6 : 1 }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
              aria-label={img.title}
              aria-pressed={on}
              className="relative min-w-0 flex-1 basis-0 overflow-hidden rounded-3xl border bg-muted text-left outline-none focus-visible:ring-4 focus-visible:ring-ring/30"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt=""
                loading="lazy"
                draggable={false}
                className={cn("absolute inset-0 size-full object-cover transition-all duration-700", on ? "scale-100 saturate-100" : "scale-110 brightness-75 saturate-50")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              {img.label && <span className="absolute left-4 top-4 rounded-full bg-background/80 px-2.5 py-1 text-[11px] font-medium tabular-nums text-foreground backdrop-blur">{img.label}</span>}
              <motion.div animate={{ opacity: on ? 1 : 0, y: on ? 0 : 16 }} transition={{ duration: 0.4, delay: on ? 0.12 : 0 }} className="absolute inset-x-5 bottom-5">
                <p className="truncate text-xl font-medium tracking-tight text-white">{img.title}</p>
              </motion.div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
