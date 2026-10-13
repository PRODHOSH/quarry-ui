"use client";

import { useCallback, useEffect, useRef, type ReactNode } from "react";
import { motion, useInView } from "framer-motion";
import { AlertTriangle, CheckCircle2, Cpu, Radio, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type JourneyStep = { icon?: ReactNode; date: string; title: string; description: string };

const DEFAULT_STEPS: JourneyStep[] = [
  { icon: <AlertTriangle />, date: "Minute 0", title: "A report comes in", description: "A citizen flags a problem from their phone. It lands in the queue with a location and a photo." },
  { icon: <Cpu />, date: "Minute 1", title: "It is triaged", description: "The system reads the report, scores how urgent it is and routes it to the right team." },
  { icon: <ShieldAlert />, date: "Minute 5", title: "A responder accepts", description: "The nearest available responder confirms. The reporter sees who is on the way." },
  { icon: <Radio />, date: "Minute 20", title: "Live updates", description: "Progress streams back as the work happens, so nobody has to ask for a status." },
  { icon: <CheckCircle2 />, date: "Same day", title: "Closed and verified", description: "The reporter confirms the fix. The case closes and feeds the next triage score." },
];

function Step({ step, index, onSee }: { step: JourneyStep; index: number; onSee: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { margin: "-35% 0px -35% 0px" });
  useEffect(() => {
    if (seen) onSee(index);
  }, [seen, index, onSee]);
  const right = index % 2 === 1;

  return (
    <li ref={ref} className="relative grid grid-cols-[3.5rem_1fr] items-start gap-x-4 md:grid-cols-[1fr_5rem_1fr] md:gap-x-0">
      <span
        className={cn(
          "z-10 col-start-1 grid size-12 place-items-center rounded-2xl border bg-card transition-colors duration-500 md:col-start-2 md:size-16 md:justify-self-center",
          seen && "border-primary/50"
        )}
      >
        <span
          className={cn(
            "grid size-8 place-items-center rounded-xl bg-muted text-muted-foreground transition-all duration-500 md:size-10 [&_svg]:size-4 md:[&_svg]:size-5",
            seen && "scale-105 bg-primary text-primary-foreground"
          )}
        >
          {step.icon}
        </span>
      </span>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className={cn("col-start-2 md:max-w-sm", right ? "md:col-start-3 md:pl-10" : "md:col-start-1 md:row-start-1 md:justify-self-end md:pr-10 md:text-right")}
      >
        <p className="text-xs font-medium uppercase tracking-widest text-primary">{step.date}</p>
        <h3 className="mt-1.5 text-xl font-semibold tracking-tight">{step.title}</h3>
        <p className="mt-2 rounded-2xl border bg-card p-5 text-left text-sm leading-relaxed text-muted-foreground">{step.description}</p>
      </motion.div>
    </li>
  );
}

/** A vertical timeline. The line fills and the markers light up as each step scrolls into the middle of the view. */
export function JourneyTimeline({
  eyebrow = "From report to response",
  title = "Every report, followed all the way through",
  steps = DEFAULT_STEPS,
  className,
}: {
  eyebrow?: string;
  title?: string;
  steps?: JourneyStep[];
  className?: string;
}) {
  const reached = useRef(-1);
  const line = useRef<HTMLSpanElement>(null);
  const onSee = useCallback((i: number) => {
    if (i <= reached.current) return;
    reached.current = i;
    if (line.current) line.current.style.height = `${((i + 0.5) / steps.length) * 100}%`;
  }, [steps.length]);

  return (
    <section className={cn("w-full px-6 py-16", className)}>
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-widest text-primary">{eyebrow}</p>
        <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
      </div>
      <div className="relative mx-auto mt-14 max-w-4xl">
        <span aria-hidden className="absolute bottom-4 left-6 top-4 w-px bg-border md:left-1/2" />
        <span ref={line} aria-hidden className="absolute left-6 top-4 w-px bg-primary transition-[height] duration-700 ease-out md:left-1/2" style={{ height: 0 }} />
        <ol className="relative flex flex-col gap-12 md:gap-16">
          {steps.map((s, i) => (
            <Step key={s.title} step={s} index={i} onSee={onSee} />
          ))}
        </ol>
      </div>
    </section>
  );
}
