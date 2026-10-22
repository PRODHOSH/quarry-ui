"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

function Placeholder() {
  return (
    <div className="grid size-full place-items-center p-8">
      <div className="grid w-full max-w-md grid-cols-3 gap-3">
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <span key={i} className={cn("h-16 rounded-xl border bg-card", i === 1 && "bg-primary/10")} />
        ))}
      </div>
    </div>
  );
}

/**
 * A centred hero: a small badge, a big headline, a one field signup that confirms in place, and a
 * wide illustration below it that rises into view. Pass any node as `illustration`.
 */
export function HeroCentered({
  badge = "Now in public beta",
  title = "The calm way to run your work",
  text = "One quiet workspace for plans, docs and decisions. Set it up in five minutes and leave the status meetings behind.",
  placeholder = "you@company.com",
  cta = "Join free",
  note = "Free for small teams. No card needed.",
  onSubmit,
  illustration,
  className,
}: {
  badge?: string;
  title?: string;
  text?: string;
  placeholder?: string;
  cta?: string;
  note?: string;
  onSubmit?: (email: string) => void;
  /** Any node. An <img> works well. It is centred and contained in the panel. */
  illustration?: ReactNode;
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  const up = (i: number) => ({ initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { delay: 0.05 + i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } });

  return (
    <section className={cn("mx-auto w-full max-w-5xl px-6 py-16 text-center lg:py-24", className)}>
      <motion.span {...up(0)} className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1 text-sm text-muted-foreground">
        <span className="size-1.5 rounded-full bg-foreground" /> {badge}
      </motion.span>
      <motion.h1 {...up(1)} className="mx-auto mt-6 max-w-3xl text-balance text-5xl font-semibold leading-[1.02] tracking-tight sm:text-7xl">{title}</motion.h1>
      <motion.p {...up(2)} className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">{text}</motion.p>

      <motion.form
        {...up(3)}
        onSubmit={(e) => {
          e.preventDefault();
          if (!/\S+@\S+\.\S+/.test(email)) return;
          onSubmit?.(email);
          setDone(true);
        }}
        className="relative mx-auto mt-8 max-w-md"
      >
        <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setDone(false); }} placeholder={placeholder} aria-label="Email address" className="h-14 w-full rounded-full border bg-card pl-6 pr-36 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/40" />
        <button type="submit" className="absolute right-2 top-2 flex h-10 items-center gap-1.5 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform active:scale-95">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={String(done)} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.15 }} className="flex items-center gap-1.5">
              {done ? <><Check className="size-4" /> Done</> : <>{cta} <ArrowRight className="size-4" /></>}
            </motion.span>
          </AnimatePresence>
        </button>
        <p className="mt-3 text-xs text-muted-foreground">{done ? "Check your inbox to finish setting up." : note}</p>
      </motion.form>

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="relative mt-14">
        <div className="relative mx-auto aspect-[16/8] max-w-4xl overflow-hidden rounded-[2rem] border bg-muted/50">
          <div aria-hidden className="absolute inset-0 [background-image:linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_85%)]" />
          <div className="absolute inset-0 grid place-items-center p-6 [&_img]:max-h-full [&_img]:w-full [&_img]:object-contain [&_svg]:max-h-full">{illustration ?? <Placeholder />}</div>
        </div>
      </motion.div>
    </section>
  );
}
