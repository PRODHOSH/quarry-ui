"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A hero style video thumbnail. Hovering pulses the play button, and a click grows the thumbnail
 * into a centred dialog that autoplays. Escape or a click outside closes it.
 */
export function VideoDialog({
  src = "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4",
  thumbnail = "https://picsum.photos/seed/quarry-video/1280/720",
  title = "Watch the 90 second tour",
  className,
}: {
  src?: string;
  thumbnail?: string;
  title?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className={cn("w-full max-w-2xl", className)}>
      <motion.button
        layoutId="video-frame"
        onClick={() => setOpen(true)}
        aria-label={title}
        transition={{ type: "spring", stiffness: 280, damping: 30 }}
        className="group relative block aspect-video w-full overflow-hidden rounded-2xl border bg-muted"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={thumbnail} alt="" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <span className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <span className="absolute inset-0 animate-ping rounded-full bg-white/40 [animation-duration:2s]" />
          <span className="relative grid size-16 place-items-center rounded-full bg-white text-black shadow-xl transition-transform group-hover:scale-110">
            <Play className="ml-0.5 size-6 fill-current" />
          </span>
        </span>
        <span className="absolute bottom-4 left-4 rounded-full bg-black/55 px-3 py-1.5 text-xs font-medium text-white backdrop-blur">{title}</span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
          >
            <motion.div
              layoutId="video-frame"
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              onClick={(e) => e.stopPropagation()}
              className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            >
              <video src={src} autoPlay controls playsInline className="size-full" />
            </motion.div>
            <button onClick={() => setOpen(false)} aria-label="Close video" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25">
              <X className="size-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
