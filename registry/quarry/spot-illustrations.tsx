"use client";

import { useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { motion, useInView } from "framer-motion";
import { Check, Copy, Search } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Small looping scenes of a product doing its job: a visitor books a slot, someone flips a setting,
 * a key is copied, a command finds a match, a meter fills. Each plays a few seconds of cursor and
 * interface, then starts again. They only run while visible, and with reduced motion they hold
 * the finished frame. Drop one in a feature card, a changelog or a landing page.
 */

/** Steps through a list of waits and loops. Pauses off screen, and holds the last step if motion is reduced. */
function useLoop(waits: number[]): [RefObject<HTMLDivElement | null>, number] {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.3 });
  const [step, setStep] = useState(0);
  const key = waits.join(",");
  useEffect(() => {
    const list = key.split(",").map(Number);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const r = requestAnimationFrame(() => setStep(list.length - 1));
      return () => cancelAnimationFrame(r);
    }
    if (!seen) return;
    let i = 0;
    let t = 0;
    const tick = () => {
      i = (i + 1) % list.length;
      setStep(i);
      t = window.setTimeout(tick, list[i]);
    };
    t = window.setTimeout(tick, list[0]);
    return () => window.clearTimeout(t);
  }, [key, seen]);
  return [ref, step];
}

function Cursor({ x, y, press }: { x: string; y: string; press?: boolean }) {
  return (
    <motion.svg
      aria-hidden
      viewBox="0 0 24 24"
      animate={{ left: x, top: y, scale: press ? 0.86 : 1 }}
      transition={{ left: { duration: 0.7, ease: [0.45, 0, 0.2, 1] }, top: { duration: 0.7, ease: [0.45, 0, 0.2, 1] }, scale: { duration: 0.12 } }}
      className="pointer-events-none absolute z-20 size-5 drop-shadow-[0_2px_3px_rgb(0_0_0/0.25)]"
    >
      <path d="M5 3l14 7.5-6 1.8-2.2 6.2L5 3Z" fill="var(--foreground)" stroke="var(--card)" strokeWidth="1.6" strokeLinejoin="round" />
    </motion.svg>
  );
}

function Spot({ title, caption, children, refEl }: { title: string; caption: string; children: ReactNode; refEl: RefObject<HTMLDivElement | null> }) {
  return (
    <figure className="m-0 overflow-hidden rounded-[1.4rem] border border-border bg-muted/60 p-2.5">
      <div ref={refEl} className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[1.05rem] border border-border bg-background">
        <div className="absolute inset-0 opacity-60 [background-image:radial-gradient(color-mix(in_oklab,var(--foreground)_10%,transparent)_1px,transparent_1px)] [background-size:14px_14px]" aria-hidden />
        {children}
      </div>
      <figcaption className="px-2 pb-1 pt-3 text-[0.82rem] leading-snug text-muted-foreground">
        <b className="font-semibold text-foreground">{title}</b>: {caption}
      </figcaption>
    </figure>
  );
}

const panel = "relative z-10 w-[78%] rounded-2xl border border-border bg-card p-3.5 text-card-foreground shadow-[0_18px_40px_-26px_rgb(0_0_0/0.35)]";

/* 1. Calendar booking */
const SLOTS = ["9:00", "10:30", "11:30", "1:00", "2:30", "4:00"];
export function CalendarBooking({ className }: { className?: string }) {
  const [ref, s] = useLoop([900, 900, 380, 800, 380, 1700]);
  const picked = s >= 2;
  const booked = s >= 4;
  const pos = [["88%", "86%"], ["54%", "50%"], ["54%", "50%"], ["66%", "81%"], ["66%", "81%"], ["66%", "81%"]][s];
  return (
    <div className={className}>
      <Spot refEl={ref} title="Calendar booking" caption="a visitor picks a time, and the call is booked on the spot.">
        <div className={panel}>
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">Book a call</p>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[0.65rem] text-muted-foreground">30 min</span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Thu 5 Nov</p>
          <div className="mt-3 grid grid-cols-3 gap-1.5">
            {SLOTS.map((t, i) => (
              <span key={t} className={cn("rounded-lg border py-1.5 text-center text-xs font-medium transition-colors duration-200", i === 1 && picked ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background")}>
                {t}
              </span>
            ))}
          </div>
          <div className={cn("mt-3 flex h-8 items-center justify-center gap-1.5 rounded-lg text-xs font-semibold transition-colors duration-300", booked ? "bg-accent text-accent-foreground" : picked ? "bg-foreground text-background" : "bg-muted text-muted-foreground")}>
            {booked ? <><Check className="size-3.5" /> Booked</> : "Confirm 10:30"}
          </div>
        </div>
        <Cursor x={pos[0]} y={pos[1]} press={s === 2 || s === 4} />
      </Spot>
    </div>
  );
}

/* 2. Settings toggles */
const ROWS = [["Email alerts", "Sign ins and billing"], ["Weekly summary", "Every Monday"], ["Two step sign in", "Ask for a code"]];
export function SettingsToggles({ className }: { className?: string }) {
  const [ref, s] = useLoop([900, 400, 700, 400, 1700]);
  const on = [true, s >= 1, s >= 3];
  const pos = [["90%", "86%"], ["80%", "52%"], ["80%", "52%"], ["80%", "76%"], ["80%", "76%"]][s];
  return (
    <div className={className}>
      <Spot refEl={ref} title="Settings toggle" caption="two step sign in switches on with a single tap.">
        <div className={cn(panel, "p-2")}>
          {ROWS.map(([a, b], i) => (
            <div key={a} className={cn("flex items-center gap-3 rounded-xl px-2.5 py-2", i < 2 && "border-b border-border/70 rounded-none")}>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold">{a}</p>
                <p className="text-[0.65rem] text-muted-foreground">{b}</p>
              </div>
              <span className={cn("relative h-5 w-9 rounded-full transition-colors duration-300", on[i] ? "bg-primary" : "bg-muted-foreground/30")}>
                <span className={cn("absolute top-0.5 size-4 rounded-full bg-white shadow transition-[left] duration-300", on[i] ? "left-[1.1rem]" : "left-0.5")} />
              </span>
            </div>
          ))}
        </div>
        <Cursor x={pos[0]} y={pos[1]} press={s === 1 || s === 3} />
      </Spot>
    </div>
  );
}

/* 3. API key copy */
export function ApiKeyCopy({ className }: { className?: string }) {
  const [ref, s] = useLoop([1100, 500, 1800]);
  const copied = s >= 1;
  const pos = [["90%", "88%"], ["76%", "52%"], ["76%", "52%"]][s];
  return (
    <div className={className}>
      <Spot refEl={ref} title="API key copy" caption="one click copies the secret key and the button confirms it.">
        <div className={panel}>
          <p className="text-sm font-semibold">Secret key</p>
          <p className="text-[0.65rem] text-muted-foreground">Created 3 days ago</p>
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-border bg-background p-1.5 pl-3">
            <code className="min-w-0 flex-1 truncate font-mono text-xs">key_••••••••3f9a</code>
            <span className={cn("grid size-8 place-items-center rounded-lg transition-colors duration-200", copied ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </span>
          </div>
          <p className={cn("mt-2.5 inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-0.5 text-[0.65rem] font-semibold text-accent-foreground transition-opacity duration-300", copied ? "opacity-100" : "opacity-0")}>
            <Check className="size-3" /> Copied
          </p>
        </div>
        <Cursor x={pos[0]} y={pos[1]} press={s === 1} />
      </Spot>
    </div>
  );
}

/* 4. Command menu */
const COMMANDS = ["Deploy project", "Deploy preview", "Dependencies", "Open settings", "Invite a teammate"];
export function CommandSpot({ className }: { className?: string }) {
  const [ref, s] = useLoop([800, 260, 260, 260, 900, 1700]);
  const typed = "dep".slice(0, Math.min(3, s));
  const list = typed ? COMMANDS.filter((c) => c.toLowerCase().includes(typed)) : COMMANDS.slice(0, 4);
  return (
    <div className={className}>
      <Spot refEl={ref} title="Command menu" caption="type three letters and the right command is ready for Enter.">
        <div className={cn(panel, "p-2")}>
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-2.5 py-2">
            <Search className="size-3.5 text-muted-foreground" />
            <span className="flex-1 text-xs">
              {typed || <span className="text-muted-foreground">Search commands</span>}
              <i className="ml-px inline-block h-3 w-px translate-y-0.5 animate-pulse bg-foreground" />
            </span>
            <kbd className="rounded border border-border px-1.5 text-[0.6rem] text-muted-foreground">⌘K</kbd>
          </div>
          <ul className="mt-1.5 space-y-0.5">
            {list.slice(0, 3).map((c, i) => (
              <li key={c} className={cn("flex items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors duration-200", i === 0 && typed ? "bg-accent font-semibold text-accent-foreground" : "text-muted-foreground")}>
                {c}
                {i === 0 && typed && <kbd className={cn("rounded border border-primary/40 px-1.5 text-[0.6rem] transition-colors", s >= 4 ? "bg-primary text-primary-foreground" : "")}>Enter</kbd>}
              </li>
            ))}
          </ul>
        </div>
      </Spot>
    </div>
  );
}

/* 5. Usage meter */
export function UsageMeter({ className }: { className?: string }) {
  const [ref, s] = useLoop([1000, 500, 1900]);
  const pct = s >= 1 ? 38 : 12;
  const used = s >= 1 ? "3,800" : "1,200";
  const pos = [["90%", "88%"], ["72%", "78%"], ["72%", "78%"]][s];
  return (
    <div className={className}>
      <Spot refEl={ref} title="Usage meter" caption="the meter shows how much of the month's API calls is used.">
        <div className={panel}>
          <div className="flex items-baseline justify-between">
            <p className="text-sm font-semibold">API calls</p>
            <span className="rounded-full bg-accent px-2 py-0.5 text-[0.65rem] font-semibold text-accent-foreground">{pct}% used</span>
          </div>
          <p className="mt-2 text-xl font-semibold tabular-nums">
            {used}
            <span className="text-xs font-normal text-muted-foreground"> of 10,000</span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary transition-[width] duration-[900ms] ease-out" style={{ width: `${pct}%` }} />
          </div>
          <div className="mt-3 flex items-center justify-between">
            <span className="text-[0.65rem] text-muted-foreground">Resets on the 1st</span>
            <span className={cn("rounded-lg px-2.5 py-1 text-xs font-semibold transition-colors", s === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")}>Import data</span>
          </div>
        </div>
        <Cursor x={pos[0]} y={pos[1]} press={s === 1} />
      </Spot>
    </div>
  );
}
