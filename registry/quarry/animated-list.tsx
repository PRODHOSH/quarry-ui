"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, GitMerge, MessageCircle, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";

type Event = { icon: ReactNode; title: string; text: string; tone: string };

const EVENTS: Event[] = [
  { icon: <CreditCard />, title: "Payment received", text: "$240.00 from Acme Studio", tone: "bg-primary/12 text-primary" },
  { icon: <UserPlus />, title: "New teammate", text: "Maya joined the design workspace", tone: "bg-primary/12 text-primary" },
  { icon: <GitMerge />, title: "Pull request merged", text: "Fix focus ring on the command menu", tone: "bg-primary/12 text-primary" },
  { icon: <MessageCircle />, title: "New comment", text: "Leo replied on the pricing draft", tone: "bg-primary/12 text-primary" },
];

/**
 * A live activity feed. New items drop in at the top with a spring, push the rest down, and the
 * oldest ones fade off the bottom. Swap the interval timer for your real event stream.
 */
export function AnimatedList({ events = EVENTS, interval = 2200, max = 4, className }: { events?: Event[]; interval?: number; max?: number; className?: string }) {
  const [feed, setFeed] = useState(() => events.slice(0, max).map((e, i) => ({ ...e, id: -i })).reverse());

  useEffect(() => {
    let n = 1;
    const t = setInterval(() => {
      const e = events[(max - 1 + n) % events.length];
      setFeed((f) => [{ ...e, id: n }, ...f].slice(0, max));
      n++;
    }, interval);
    return () => clearInterval(t);
  }, [events, interval, max]);

  return (
    <div className={cn("w-full max-w-sm [mask-image:linear-gradient(to_bottom,black_70%,transparent)]", className)}>
      <ul className="flex flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {feed.map((e) => (
            <motion.li
              key={e.id}
              layout
              initial={{ opacity: 0, scale: 0.9, y: -24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 380, damping: 30 }}
              className="flex items-center gap-3 rounded-2xl border bg-card p-3.5"
            >
              <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl [&_svg]:size-4.5", e.tone)}>{e.icon}</span>
              <span className="min-w-0 leading-tight">
                <span className="block truncate text-sm font-medium">{e.title}</span>
                <span className="block truncate text-xs text-muted-foreground">{e.text}</span>
              </span>
              <span className="ml-auto shrink-0 text-[11px] text-muted-foreground">now</span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  );
}
