"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { animate } from "framer-motion";
import { Check, Copy, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Choice = { id: string; label: string; note: string; price: number };

const DESIGN: Choice[] = [
  { id: "template", label: "Start from a template", note: "Fast, polished, shared look", price: 0 },
  { id: "custom", label: "Custom design", note: "Made for your brand", price: 2400 },
  { id: "system", label: "Brand and design system", note: "Identity plus reusable parts", price: 5200 },
];
const FEATURES: Choice[] = [
  { id: "cms", label: "Content editor", note: "Update pages yourself", price: 1800 },
  { id: "store", label: "Online store", note: "Catalogue and checkout", price: 4800 },
  { id: "booking", label: "Booking", note: "Calendar and reminders", price: 2200 },
  { id: "auth", label: "Accounts", note: "Sign in and profiles", price: 2600 },
  { id: "i18n", label: "Two languages", note: "Switcher and translations", price: 1500 },
  { id: "analytics", label: "Analytics", note: "Goals and dashboards", price: 900 },
];
const TIMELINE: Choice[] = [
  { id: "relaxed", label: "Relaxed", note: "8 weeks or more", price: -0.05 },
  { id: "standard", label: "Standard", note: "About 5 weeks", price: 0 },
  { id: "rush", label: "Rush", note: "Within 2 weeks", price: 0.35 },
];
const PAGE_COST = 380;
const BASE = 600;
const REVISION_COST = 350;
const SEGMENTS = ["var(--primary)", "var(--background)", "var(--ring)", "color-mix(in oklab, var(--background) 45%, var(--foreground))"];

type State = { pages: number; design: string; revisions: number; features: string[]; timeline: string };
const INITIAL: State = { pages: 8, design: "custom", revisions: 2, features: ["cms"], timeline: "standard" };

function price(s: State) {
  const pages = BASE + s.pages * PAGE_COST;
  const design = (DESIGN.find((d) => d.id === s.design)?.price ?? 0) + Math.max(0, s.revisions - 2) * REVISION_COST;
  const features = s.features.reduce((n, f) => n + (FEATURES.find((x) => x.id === f)?.price ?? 0), 0);
  const subtotal = pages + design + features;
  const rate = TIMELINE.find((t) => t.id === s.timeline)?.price ?? 0;
  const timeline = Math.round(subtotal * rate);
  return { parts: [pages, design, features, timeline], total: subtotal + timeline };
}
const money = (v: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
      <h3 className="mb-5 flex items-center gap-3 text-xl font-medium tracking-tight text-card-foreground">
        <span className="grid size-7 place-items-center rounded-lg bg-foreground text-xs font-semibold text-background">{String(n).padStart(2, "0")}</span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Range({ label, value, min, max, suffix, onChange, hint }: { label: string; value: number; min: number; max: number; suffix: string; onChange: (v: number) => void; hint?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between text-sm">
        <label className="font-medium text-card-foreground">{label}</label>
        <span className="font-semibold tabular-nums text-foreground">{value} {suffix}</span>
      </div>
      <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-3 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-muted accent-foreground" />
      {hint && <p className="mt-2 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Pick({ options, value, onPick, multi }: { options: Choice[]; value: string[]; onPick: (id: string) => void; multi?: boolean }) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {options.map((o) => {
        const on = value.includes(o.id);
        return (
          <button
            key={o.id}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={on}
            onClick={() => onPick(o.id)}
            className={cn("rounded-xl border px-3.5 py-3 text-left transition-colors", on ? "border-foreground bg-foreground text-background" : "border-border bg-muted/50 text-card-foreground hover:border-foreground/40")}
          >
            <span className="block text-sm font-medium">{o.label}</span>
            <span className={cn("mt-0.5 block text-xs", on ? "text-background/65" : "text-muted-foreground")}>{o.note}</span>
          </button>
        );
      })}
    </div>
  );
}

function Donut({ parts, total }: { parts: number[]; total: number }) {
  const R = 84;
  const C = 2 * Math.PI * R;
  const sum = parts.reduce((x, y) => x + Math.max(0, y), 0) || 1;
  const lens = parts.map((p) => (Math.max(0, p) / sum) * C);
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((x, y) => x + y, 0));
  return (
    <svg viewBox="0 0 200 200" className="mx-auto size-full max-w-[15rem]" role="img" aria-label={`Estimate ${money(total)}`}>
      <circle cx="100" cy="100" r={R} fill="none" stroke="currentColor" strokeOpacity="0.1" strokeWidth="20" />
      {lens.map((len, i) => (
        <circle
          key={i}
          cx="100"
          cy="100"
          r={R}
          fill="none"
          stroke={SEGMENTS[i]}
          strokeWidth="20"
          strokeDasharray={`${Math.max(0, len - 3)} ${C}`}
          strokeDashoffset={-starts[i]}
          transform="rotate(-90 100 100)"
          style={{ transition: "stroke-dasharray .6s cubic-bezier(.22,1,.36,1), stroke-dashoffset .6s cubic-bezier(.22,1,.36,1)" }}
        />
      ))}
    </svg>
  );
}

/**
 * A project cost estimator. Four cards of sliders and choices on the left, and a sticky result on the
 * right: a ring chart that splits the total, the figure itself, and the three changes that would
 * save the most. Everything recalculates as you move. Copy the summary or reset in one click.
 */
export function QuoteEstimator({ className }: { className?: string }) {
  const [s, setS] = useState<State>(INITIAL);
  const [copied, setCopied] = useState(false);
  const [shown, setShown] = useState(price(INITIAL).total);
  const shownRef = useRef(shown);
  const result = useMemo(() => price(s), [s]);

  useEffect(() => {
    const controls = animate(shownRef.current, result.total, {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        shownRef.current = v;
        setShown(v);
      },
    });
    return () => controls.stop();
  }, [result.total]);

  const wins = useMemo(() => {
    const options: { label: string; next: State }[] = [];
    if (s.pages > 3) options.push({ label: "Trim two pages", next: { ...s, pages: Math.max(1, s.pages - 2) } });
    if (s.design !== "template") options.push({ label: "Start from a template", next: { ...s, design: "template" } });
    else options.push({ label: "Keep the design to one round", next: { ...s, revisions: 1 } });
    if (s.revisions > 2) options.push({ label: "Limit to two revision rounds", next: { ...s, revisions: 2 } });
    if (s.timeline === "rush") options.push({ label: "Move to a standard timeline", next: { ...s, timeline: "standard" } });
    s.features.forEach((f) => options.push({ label: `Launch without ${FEATURES.find((x) => x.id === f)?.label.toLowerCase()}`, next: { ...s, features: s.features.filter((x) => x !== f) } }));
    return options.map((o) => ({ label: o.label, save: result.total - price(o.next).total })).filter((o) => o.save > 0).sort((a, b) => b.save - a.save).slice(0, 3);
  }, [s, result.total]);

  const labels = ["Pages", "Design", "Features", s.timeline === "relaxed" ? "Early bird" : "Timeline"];
  const summary = `Project estimate: ${money(result.total)}\n${s.pages} pages, ${DESIGN.find((d) => d.id === s.design)?.label}, ${s.revisions} revision rounds, ${s.features.length} features, ${TIMELINE.find((t) => t.id === s.timeline)?.label} timeline.`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <div className={cn("mx-auto grid w-full max-w-6xl gap-4 p-[clamp(1rem,3vw,2rem)] lg:grid-cols-[1.35fr_1fr] lg:items-start", className)}>
      <div className="grid gap-4">
        <Section n={1} title="Pages">
          <Range label="Pages on the site" value={s.pages} min={1} max={40} suffix="pages" onChange={(pages) => setS({ ...s, pages })} hint={`${money(PAGE_COST)} per page after a ${money(BASE)} setup.`} />
        </Section>
        <Section n={2} title="Design">
          <div className="grid gap-5">
            <Pick options={DESIGN} value={[s.design]} onPick={(design) => setS({ ...s, design })} />
            <Range label="Rounds of revisions" value={s.revisions} min={1} max={5} suffix="rounds" onChange={(revisions) => setS({ ...s, revisions })} hint={`Two rounds are included. Extra rounds are ${money(REVISION_COST)} each.`} />
          </div>
        </Section>
        <Section n={3} title="Features">
          <Pick multi options={FEATURES} value={s.features} onPick={(id) => setS({ ...s, features: s.features.includes(id) ? s.features.filter((f) => f !== id) : [...s.features, id] })} />
        </Section>
        <Section n={4} title="Timeline">
          <Pick options={TIMELINE.map((t) => ({ ...t, note: `${t.note}${t.price ? (t.price > 0 ? `, +${Math.round(t.price * 100)}%` : `, ${Math.round(t.price * 100)}%`) : ""}` }))} value={[s.timeline]} onPick={(timeline) => setS({ ...s, timeline })} />
        </Section>
      </div>

      <aside className="rounded-3xl bg-foreground p-5 text-background shadow-[0_30px_70px_-40px_rgb(0_0_0/0.6)] sm:p-6 lg:sticky lg:top-6">
        <div className="relative mx-auto grid aspect-square w-full max-w-[15rem] place-items-center text-background">
          <div className="absolute inset-0"><Donut parts={result.parts} total={result.total} /></div>
          <div className="relative text-center">
            <p className="text-[clamp(2rem,1.4rem+2vw,2.8rem)] font-medium leading-none tracking-tight tabular-nums">{money(Math.round(shown))}</p>
            <p className="mt-1.5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-background/55">Estimated total</p>
          </div>
        </div>
        <ul className="mt-5 space-y-2 text-sm">
          {result.parts.map((p, i) => (
            <li key={labels[i]} className="flex items-center gap-2.5">
              <i className="size-2.5 rounded-sm" style={{ background: SEGMENTS[i] }} />
              <span className="flex-1 text-background/75">{labels[i]}</span>
              <span className="tabular-nums text-background/55">{money(p)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-background/12 pt-4">
          <p className="text-sm font-semibold">Your three biggest savings</p>
          {wins.length ? (
            <ul className="mt-2.5 space-y-1.5 rounded-xl bg-background/[0.06] p-3 text-sm">
              {wins.map((w) => (
                <li key={w.label} className="flex items-center justify-between gap-3">
                  <span className="text-background/80">{w.label}</span>
                  <b className="font-medium tabular-nums text-primary">−{money(w.save)}</b>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-background/60">This is already the leanest version.</p>
          )}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button type="button" onClick={copy} className="inline-flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-transform active:scale-95">
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />} {copied ? "Copied" : "Copy summary"}
          </button>
          <button type="button" onClick={() => setS(INITIAL)} className="inline-flex h-10 items-center gap-2 rounded-xl bg-background/10 px-4 text-sm font-medium transition-colors hover:bg-background/20">
            <RotateCcw className="size-4" /> Reset
          </button>
        </div>
      </aside>
    </div>
  );
}
