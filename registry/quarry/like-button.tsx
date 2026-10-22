"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A like button that celebrates. The heart pops with a spring, a ring of small dots bursts outward,
 * and the count rolls up or down. Works controlled (`liked`, `onLikedChange`) or on its own.
 */
export function LikeButton({
  count = 128,
  defaultLiked = false,
  liked: controlled,
  onLikedChange,
  className,
}: {
  count?: number;
  defaultLiked?: boolean;
  liked?: boolean;
  onLikedChange?: (liked: boolean) => void;
  className?: string;
}) {
  const [inner, setInner] = useState(defaultLiked);
  const [burst, setBurst] = useState(0);
  const liked = controlled ?? inner;
  const n = count + (liked && !defaultLiked ? 1 : !liked && defaultLiked ? -1 : 0);

  const toggle = () => {
    const next = !liked;
    setInner(next);
    if (next) setBurst((b) => b + 1);
    onLikedChange?.(next);
  };

  return (
    <button type="button" aria-pressed={liked} aria-label={liked ? "Unlike" : "Like"} onClick={toggle} className={cn("group inline-flex items-center gap-2.5 rounded-full border bg-card py-2 pl-3 pr-4 transition-colors hover:border-foreground/30", className)}>
      <span className="relative grid size-7 place-items-center">
        <AnimatePresence>
          {burst > 0 && liked && (
            <motion.span key={burst} aria-hidden className="pointer-events-none absolute inset-0">
              {Array.from({ length: 8 }).map((_, i) => {
                const a = (i / 8) * Math.PI * 2;
                return <motion.span key={i} initial={{ x: 0, y: 0, scale: 1, opacity: 1 }} animate={{ x: Math.cos(a) * 22, y: Math.sin(a) * 22, scale: 0, opacity: 0 }} transition={{ duration: 0.55, ease: "easeOut" }} className="absolute left-1/2 top-1/2 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary" />;
              })}
            </motion.span>
          )}
        </AnimatePresence>
        <motion.span key={`${liked}`} initial={{ scale: liked ? 0.4 : 1 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 12 }} className="flex">
          <Heart className={cn("size-5 transition-colors", liked ? "fill-primary text-primary" : "text-muted-foreground group-hover:text-foreground")} />
        </motion.span>
      </span>
      <span className="relative h-5 overflow-hidden text-sm font-medium tabular-nums">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span key={n} initial={{ y: liked ? 14 : -14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: liked ? -14 : 14, opacity: 0 }} transition={{ duration: 0.22 }} className="block">{n}</motion.span>
        </AnimatePresence>
      </span>
    </button>
  );
}
