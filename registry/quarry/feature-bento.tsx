"use client";

import { useRef, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;

/** A bento cell with a spotlight that follows the pointer across its surface and border. */
function Cell({ className, children, index }: { className?: string; children: ReactNode; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28, filter: "blur(6px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, delay: index * 0.08, ease: EASE }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn("group relative overflow-hidden rounded-3xl border bg-card p-6 transition-colors duration-500 hover:border-primary/40", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(380px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--primary) 16%, transparent), transparent 70%)" }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  );
}

const Label = ({ title, text }: { title: string; text: string }) => (
  <div className="mt-auto pt-6">
    <h3 className="text-lg font-semibold tracking-tight text-card-foreground">{title}</h3>
    <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-muted-foreground">{text}</p>
  </div>
);

/** Lines of code that type themselves in, over and over. */
function CodeVisual() {
  const lines = [
    ["w-1/3", "bg-primary/70"],
    ["w-2/3", "bg-muted-foreground/40"],
    ["w-1/2", "bg-muted-foreground/40"],
    ["w-3/4", "bg-primary/40"],
    ["w-2/5", "bg-muted-foreground/40"],
  ];
  return (
    <div className="rounded-2xl border bg-background/60 p-4">
      <div className="mb-3 flex gap-1.5">
        {[0, 1, 2].map((d) => (
          <span key={d} className="size-2 rounded-full bg-border" />
        ))}
      </div>
      <div className="space-y-2.5">
        {lines.map(([w, c], i) => (
          <motion.span
            key={i}
            className={cn("block h-2 origin-left rounded-full", w, c)}
            animate={{ scaleX: [0, 1, 1, 0] }}
            transition={{ duration: 4.2, repeat: Infinity, delay: i * 0.25, times: [0, 0.3, 0.85, 1], ease: "easeInOut" }}
          />
        ))}
      </div>
    </div>
  );
}

/** Rings that ping outward from a shield. */
function RingsVisual() {
  return (
    <div className="relative grid h-32 place-items-center">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute size-14 rounded-full border border-primary/50"
          animate={{ scale: [1, 3.2], opacity: [0.7, 0] }}
          transition={{ duration: 3, repeat: Infinity, delay: i, ease: "easeOut" }}
        />
      ))}
      <span className="relative grid size-14 place-items-center rounded-full bg-primary text-primary-foreground">
        <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3 4 6v6c0 4.5 3.2 8.2 8 9 4.8-.8 8-4.5 8-9V6l-8-3Z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
      </span>
    </div>
  );
}

/** Cards that fan out when you hover the cell. */
function StackVisual() {
  const fan = ["group-hover:[rotate:-7deg] group-hover:[translate:-14px_-4px]", "group-hover:[translate:0_-10px]", "group-hover:[rotate:7deg] group-hover:[translate:14px_-4px]"];
  return (
    <div className="relative h-32">
      {fan.map((f, i) => (
        <div
          key={i}
          className={cn("absolute inset-x-6 top-4 h-20 rounded-2xl border bg-background shadow-lg transition-all duration-700 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]", f)}
          style={{ transform: `translateY(${i * 10}px) scale(${1 - (2 - i) * 0.06})`, zIndex: i }}
        >
          <div className="m-3 h-2 w-1/3 rounded-full bg-primary/60" />
          <div className="mx-3 h-2 w-2/3 rounded-full bg-border" />
        </div>
      ))}
    </div>
  );
}

/** Bars that rise in, then breathe. */
function BarsVisual() {
  const heights = [38, 62, 46, 80, 58, 92, 70];
  return (
    <div className="flex h-32 items-end gap-2.5">
      {heights.map((h, i) => (
        <motion.span
          key={i}
          className="flex-1 rounded-t-lg bg-gradient-to-t from-primary/20 to-primary"
          initial={{ height: 0 }}
          whileInView={{ height: `${h}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1 * i, ease: EASE }}
        />
      ))}
    </div>
  );
}

/**
 * A bento of five cells with different sizes. Each one has a small living visual, and a spotlight
 * follows the pointer across whichever cell you are over.
 */
export function FeatureBento({
  eyebrow = "Why teams choose us",
  title = "Everything you need to build interfaces that last",
  className,
}: {
  eyebrow?: string;
  title?: string;
  className?: string;
}) {
  return (
    <section className={cn("w-full px-6 py-12 sm:px-10", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="mb-10 max-w-xl">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">{eyebrow}</p>
          <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">{title}</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-6">
          <Cell index={0} className="md:col-span-4 md:row-span-1">
            <CodeVisual />
            <Label title="Ready in minutes" text="Drop a component into your project and ship. No configuration, no setup, no waiting on a design handoff." />
          </Cell>
          <Cell index={1} className="md:col-span-2">
            <RingsVisual />
            <Label title="Accessible by default" text="Keyboard friendly, screen reader aware, contrast checked." />
          </Cell>
          <Cell index={2} className="md:col-span-2">
            <StackVisual />
            <Label title="Composable" text="Small pieces that combine into pages." />
          </Cell>
          <Cell index={3} className="md:col-span-4">
            <BarsVisual />
            <Label title="Built to scale" text="Tokens drive every color, radius and shadow, so one change updates the whole product." />
          </Cell>
        </div>
      </div>
    </section>
  );
}
