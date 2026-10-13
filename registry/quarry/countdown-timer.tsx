"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const parts = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
};

function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1.1em] w-[0.62em] overflow-hidden text-center tabular-nums">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: "-70%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "70%", opacity: 0, filter: "blur(4px)" }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
          className="absolute inset-0"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

/**
 * A live countdown. Each digit rolls when it changes. The target is any date string or timestamp.
 * It renders blank on the server and fills in on the client, so there is no hydration mismatch.
 */
export function CountdownTimer({
  target,
  label = "Doors open in",
  doneLabel = "It has started",
  onComplete,
  className,
}: {
  target?: string | number | Date;
  label?: string;
  doneLabel?: string;
  onComplete?: () => void;
  className?: string;
}) {
  const [left, setLeft] = useState<number | null>(null);

  useEffect(() => {
    // Without a target, count down from three days so the preview always has something to show.
    const end = target ? new Date(target).getTime() : Date.now() + 3 * 86400_000 + 4 * 3600_000;
    let fired = false;
    const tick = () => {
      const ms = end - Date.now();
      setLeft(ms);
      if (ms <= 0 && !fired) {
        fired = true;
        onComplete?.();
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target, onComplete]);

  const t = parts(left ?? 0);
  const units: [string, number][] = [["Days", t.days], ["Hours", t.hours], ["Minutes", t.minutes], ["Seconds", t.seconds]];

  return (
    <div className={cn("flex flex-col items-center gap-5", className)} role="timer" aria-live="off">
      <p className="text-xs font-medium uppercase tracking-[0.25em] text-muted-foreground">{left !== null && left <= 0 ? doneLabel : label}</p>
      <div className="flex items-start gap-2 sm:gap-4">
        {units.map(([name, value], i) => (
          <div key={name} className="flex items-start gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-2">
              <div className="rounded-2xl border bg-card px-3 py-3 text-4xl font-semibold leading-none sm:px-5 sm:py-4 sm:text-6xl">
                {left === null ? (
                  <span className="invisible">00</span>
                ) : (
                  String(value).padStart(2, "0").split("").map((d, k) => <Digit key={k} value={d} />)
                )}
              </div>
              <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{name}</span>
            </div>
            {i < units.length - 1 && <span aria-hidden className="pt-3 text-3xl text-primary/60 sm:pt-4 sm:text-5xl">:</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
