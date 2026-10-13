"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { badge: string; text: string; href?: string };

const MESSAGES: Message[] = [
  { badge: "New", text: "Version 2.0 is here, rebuilt around a faster editor." },
  { badge: "Event", text: "Join our live product tour on Thursday at 4pm." },
  { badge: "Offer", text: "Get 20% off annual plans until the end of the month." },
];

/**
 * A dismissible top announcement bar. Messages rotate with a soft vertical slide, pause while the
 * pointer is over them, and the bar collapses smoothly when closed.
 */
export function AnnouncementBar({
  messages = MESSAGES,
  interval = 4000,
  className,
}: {
  messages?: Message[];
  interval?: number;
  className?: string;
}) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    if (paused || messages.length < 2) return;
    const t = setInterval(() => setI((v) => (v + 1) % messages.length), interval);
    return () => clearInterval(t);
  }, [paused, messages.length, interval]);

  const m = messages[i];

  return (
    <AnimatePresence initial={false}>
      {open ? (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          className={cn("w-full overflow-hidden", className)}
        >
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative flex items-center justify-center gap-3 bg-primary px-10 py-2.5 text-primary-foreground"
          >
            <div className="relative h-5 w-full max-w-xl overflow-hidden">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.a
                  key={i}
                  href={m.href ?? "#"}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  className="group absolute inset-0 flex items-center justify-center gap-2.5 text-sm"
                >
                  <span className="rounded-full bg-primary-foreground/15 px-2 py-0.5 text-[11px] font-medium uppercase tracking-wide">{m.badge}</span>
                  <span className="truncate">{m.text}</span>
                  <ArrowRight className="size-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </motion.a>
              </AnimatePresence>
            </div>
            <div className="absolute inset-y-0 right-10 hidden items-center gap-1 sm:flex">
              {messages.map((_, n) => (
                <span key={n} className={cn("h-1 rounded-full bg-primary-foreground transition-all", n === i ? "w-4 opacity-100" : "w-1 opacity-40")} />
              ))}
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Dismiss announcement"
              className="absolute right-3 top-1/2 grid size-6 -translate-y-1/2 place-items-center rounded-md transition-colors hover:bg-primary-foreground/15"
            >
              <X className="size-3.5" />
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          key="reopen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setOpen(true)}
          className="rounded-full border bg-card px-3 py-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          Show announcement
        </motion.button>
      )}
    </AnimatePresence>
  );
}
