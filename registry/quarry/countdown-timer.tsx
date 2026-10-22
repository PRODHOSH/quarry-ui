"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

const parts = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { days: Math.floor(s / 86400), hours: Math.floor((s % 86400) / 3600), minutes: Math.floor((s % 3600) / 60), seconds: s % 60 };
};

/** One flip digit: the new number tips in from the top while the old one tips away, like a split-flap board. */
function Digit({ value }: { value: string }) {
  return (
    <span className="relative inline-block h-[1.1em] w-[0.62em] text-center tabular-nums [perspective:400px]">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ rotateX: -80, opacity: 0, y: "-12%" }}
          animate={{ rotateX: 0, opacity: 1, y: 0 }}
          exit={{ rotateX: 80, opacity: 0, y: "12%" }}
          transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
          style={{ transformOrigin: "50% 50%" }}
          className="absolute inset-0"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const fmt = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "short", day: "numeric", month: "short" }) + " at " + d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

/**
 * A flip clock countdown. Days, hours, minutes and seconds each get their own hinged card with a
 * split line and side notches, and every digit tips over when it changes. A small header shows the
 * exact moment you are counting toward, and a line under the seconds card fills as the minute passes.
 * The target is any date string or timestamp. It renders blank on the server and fills in on the
 * client, so there is no hydration mismatch.
 */
export function CountdownTimer({
  target,
  label = "Launching",
  doneLabel = "We are live",
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
  const [when, setWhen] = useState("");

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
    const label = window.setTimeout(() => setWhen(fmt(new Date(end))), 0);
    const id = window.setInterval(tick, 1000);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(label);
    };
  }, [target, onComplete]);

  const t = parts(left ?? 0);
  const finished = left !== null && left <= 0;
  const units: [string, number][] = [["Days", t.days], ["Hours", t.hours], ["Minutes", t.minutes], ["Seconds", t.seconds]];

  return (
    <div className={cn("flex flex-col items-center gap-7", className)} role="timer" aria-live="off">
      <div className="flex items-center gap-3 rounded-full border bg-card/70 py-1.5 pl-3 pr-4 text-sm backdrop-blur">
        <span className="relative flex size-2">
          <span className={cn("absolute inline-flex size-full rounded-full bg-foreground/50", !finished && "animate-ping")} />
          <span className="relative inline-flex size-2 rounded-full bg-foreground" />
        </span>
        <span className="font-medium">{finished ? doneLabel : label}</span>
        {when && !finished && (
          <>
            <span className="h-3.5 w-px bg-border" />
            <span className="text-muted-foreground">{when}</span>
          </>
        )}
      </div>

      <div className="flex items-start gap-2 sm:gap-4">
        {units.map(([name, value], i) => (
          <div key={name} className="flex items-start gap-2 sm:gap-4">
            <div className="flex flex-col items-center gap-3">
              <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-card to-muted/60 px-3 py-4 text-[2.4rem] font-semibold leading-none tracking-tight shadow-[0_18px_40px_-24px_rgba(0,0,0,0.6)] sm:rounded-3xl sm:px-6 sm:py-7 sm:text-8xl">
                {left === null ? (
                  <span className="invisible">00</span>
                ) : (
                  String(value).padStart(2, "0").split("").map((d, k) => <Digit key={k} value={d} />)
                )}
                {/* the hinge */}
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 h-px bg-background/70 shadow-[0_1px_0_0_rgba(255,255,255,0.08)]" />
                <span aria-hidden className="pointer-events-none absolute -left-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-background" />
                <span aria-hidden className="pointer-events-none absolute -right-1 top-1/2 size-2 -translate-y-1/2 rounded-full bg-background" />
                <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-foreground/[0.06] to-transparent" />
                {name === "Seconds" && left !== null && (
                  <span aria-hidden className="absolute inset-x-0 bottom-0 h-[3px] bg-border">
                    <motion.span className="block h-full origin-left bg-foreground" animate={{ scaleX: (t.seconds + 1) / 60 }} transition={{ duration: 1, ease: "linear" }} />
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-muted-foreground">{name}</span>
            </div>
            {i < units.length - 1 && (
              <span aria-hidden className="flex flex-col gap-2 pt-[1.2rem] sm:gap-3 sm:pt-[2.6rem]">
                <span className="size-1.5 rounded-full bg-muted-foreground/50 sm:size-2" />
                <span className="size-1.5 rounded-full bg-muted-foreground/50 sm:size-2" />
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
