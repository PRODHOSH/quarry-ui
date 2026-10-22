"use client";

import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { Check, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Milestone = { label: string; text: string };

const MILESTONES: Milestone[] = [
  { label: "Idea", text: "A sketch, a sentence and a reason to start." },
  { label: "Prototype", text: "Something real enough to click and argue about." },
  { label: "Launch", text: "Out the door to the first hundred people." },
  { label: "Scale", text: "What works gets faster. What does not gets cut." },
];

/** The running figure is the "Sprinting" doodle from Open Doodles by Pablo Stanley (CC0, public domain). */
const RUNNER = "https://opendoodles.s3-us-west-1.amazonaws.com/sprinting.gif";

/**
 * A roadmap that runs. When it scrolls into view, a sprinting doodle dashes along the track and
 * each milestone checks itself off as the runner passes. A small button replays the run. The doodle
 * has black ink, so the whole section is a clean white sheet with dark type. That keeps the drawing
 * crisp in any theme, with no box around it.
 */
export function SprintRoadmap({
  eyebrow = "How we work",
  title = "From idea to launch, at a sprint",
  milestones = MILESTONES,
  runner = RUNNER,
  duration = 4.5,
  className,
}: {
  eyebrow?: string;
  title?: string;
  milestones?: Milestone[];
  /** Image of the runner. Any transparent GIF or PNG works. */
  runner?: string;
  /** Seconds for the full run. */
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const progress = useMotionValue(0);
  const left = useTransform(progress, (p) => `${p * 100}%`);
  const fill = useTransform(progress, (p) => `${p * 100}%`);
  const [reached, setReached] = useState(0);
  const [running, setRunning] = useState(false);
  const [run, setRun] = useState(0);
  const n = milestones.length;

  useMotionValueEvent(progress, "change", (p) => setReached(Math.min(n, Math.floor(p * (n - 1) + 0.0001) + 1)));

  useEffect(() => {
    if (!inView) return;
    progress.set(0);
    const c = animate(progress, 1, { duration, ease: [0.45, 0.05, 0.25, 1], onPlay: () => setRunning(true), onComplete: () => setRunning(false) });
    return () => c.stop();
  }, [inView, run, duration, progress]);

  const done = reached === n && !running;

  return (
    <section ref={ref} className={cn("mx-auto w-full max-w-5xl rounded-[2rem] border border-neutral-200 bg-white px-6 py-10 text-neutral-950 sm:px-12 sm:py-14", className)}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">{eyebrow}</p>
          <h2 className="mt-2 max-w-xl text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        </div>
        <button
          type="button"
          onClick={() => setRun((r) => r + 1)}
          disabled={running}
          className="inline-flex h-9 shrink-0 items-center gap-2 self-start rounded-full border border-neutral-200 px-4 text-sm text-neutral-500 transition-colors hover:text-neutral-950 disabled:pointer-events-none disabled:opacity-40 sm:self-auto"
        >
          <RotateCcw className="size-3.5" /> Run again
        </button>
      </div>

      <div className="relative mt-24 px-10">
        {/* the runner rides above the track */}
        <div className="pointer-events-none absolute inset-x-10 -top-[5.25rem] h-24">
          <motion.div style={{ left }} className="absolute bottom-0 -translate-x-1/2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={runner} alt="" draggable={false} className="h-24 w-auto select-none" />
            <span aria-hidden className="absolute -bottom-0.5 left-1/2 h-1.5 w-14 -translate-x-1/2 rounded-full bg-neutral-950/10 blur-[3px]" />
          </motion.div>
        </div>

        <div className="relative h-px bg-neutral-200">
          <motion.div style={{ width: fill }} className="absolute inset-y-[-1px] left-0 h-[3px] rounded-full bg-neutral-950" />
          {milestones.map((m, i) => {
            const on = i < reached;
            return (
              <span key={m.label} style={{ left: `${(i / (n - 1)) * 100}%` }} className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2">
                <motion.span
                  animate={{ scale: on ? 1 : 0.8, backgroundColor: on ? "#0a0a0a" : "#ffffff", borderColor: on ? "#0a0a0a" : "#e5e5e5" }}
                  transition={{ type: "spring", stiffness: 400, damping: 22 }}
                  className="grid size-6 place-items-center rounded-full border-2 text-white"
                >
                  {on && <Check className="size-3.5" strokeWidth={3} />}
                </motion.span>
              </span>
            );
          })}
        </div>

        <ol className="mt-8 grid gap-4" style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))` }}>
          {milestones.map((m, i) => {
            const on = i < reached;
            const align = i === 0 ? "text-left" : i === n - 1 ? "text-right" : "text-center";
            return (
              <li key={m.label} className={cn("transition-opacity duration-300", align, on ? "opacity-100" : "opacity-40")}>
                <p className="text-sm font-semibold sm:text-base">{m.label}</p>
                <p className="mt-1 hidden text-sm leading-relaxed text-neutral-500 sm:block">{m.text}</p>
              </li>
            );
          })}
        </ol>
      </div>

      <p aria-live="polite" className={cn("mt-10 text-center text-sm text-neutral-500 transition-opacity duration-500", done ? "opacity-100" : "opacity-0")}>
        Every step done. That is the whole race.
      </p>
    </section>
  );
}
