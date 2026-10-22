"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BookOpen, ClipboardCheck, FileText, GraduationCap, HelpCircle, Route, X } from "lucide-react";
import { initials, type Kind, type Status } from "@/lib/lms/data";
import { cn } from "@/lib/utils";

export const KIND_META: Record<Kind, { label: string; icon: typeof FileText; bg: string }> = {
  course: { label: "Course", icon: GraduationCap, bg: "bg-chart-5" },
  page: { label: "Page", icon: FileText, bg: "bg-primary" },
  assignment: { label: "Assignment", icon: ClipboardCheck, bg: "bg-chart-2" },
  quiz: { label: "Quiz", icon: HelpCircle, bg: "bg-chart-4" },
  path: { label: "Learning Path", icon: Route, bg: "bg-chart-3" },
};

export function KindIcon({ kind, className }: { kind: Kind; className?: string }) {
  const m = KIND_META[kind] ?? { icon: BookOpen, bg: "bg-muted" };
  const Icon = m.icon;
  return (
    <span className={cn("grid size-7 shrink-0 place-items-center rounded-lg text-white", m.bg, className)}>
      <Icon className="size-3.5" />
    </span>
  );
}

const TONES = ["bg-chart-1/15 text-chart-1", "bg-chart-5/20 text-chart-5", "bg-chart-2/20 text-chart-2", "bg-chart-3/15 text-chart-3", "bg-chart-4/20 text-chart-4"];

export function Avatar({ name, size = 36, className }: { name: string; size?: number; className?: string }) {
  const tone = TONES[(name.charCodeAt(0) + name.length) % TONES.length];
  return (
    <span aria-hidden style={{ width: size, height: size, fontSize: size * 0.36 }} className={cn("grid shrink-0 place-items-center rounded-full font-semibold", tone, className)}>
      {initials(name)}
    </span>
  );
}

export const STATUS_DOT: Record<Status, string> = {
  "not-started": "bg-muted-foreground/50",
  "in-progress": "bg-chart-5",
  completed: "bg-chart-1",
  overdue: "bg-destructive",
  failed: "bg-chart-2",
};

/** A small circular progress ring. */
export function Ring({ value, size = 22, stroke = 3, className }: { value: number; size?: number; stroke?: number; className?: string }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className={cn("-rotate-90", className)} aria-hidden>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="stroke-muted" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        className="stroke-chart-4"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={{ strokeDashoffset: c * (1 - value / 100) }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

/** Flat generated artwork for content covers. Colours come from the theme, so it never needs image files. */
export function Art({ variant, className }: { variant: number; className?: string }) {
  const v = variant % 4;
  const palettes = [
    ["fill-chart-1", "fill-chart-2", "fill-card"],
    ["fill-chart-2", "fill-chart-1", "fill-card"],
    ["fill-chart-5", "fill-chart-2", "fill-card"],
    ["fill-chart-2", "fill-chart-5", "fill-card"],
  ][v];
  const bg = ["bg-chart-1/25", "bg-chart-2/25", "bg-chart-5/25", "bg-chart-3/20"][v];
  return (
    <div className={cn("relative overflow-hidden", bg, className)}>
      <svg viewBox="0 0 320 120" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
        {v === 0 && (
          <>
            <rect x="60" y="22" width="200" height="86" rx="10" className={palettes[2]} />
            <rect x="74" y="36" width="90" height="10" rx="5" className={palettes[0]} />
            <rect x="74" y="56" width="140" height="8" rx="4" className="fill-muted" />
            <rect x="74" y="72" width="110" height="8" rx="4" className="fill-muted" />
            <circle cx="236" cy="44" r="18" className={palettes[1]} />
          </>
        )}
        {v === 1 && (
          <>
            <path d="M40 100 L110 70 L160 82 L230 36 L276 24" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" fill="none" className="stroke-foreground/80" />
            <circle cx="110" cy="70" r="9" className={palettes[1]} />
            <circle cx="230" cy="36" r="11" className={palettes[0]} />
            <rect x="40" y="104" width="240" height="6" rx="3" className="fill-foreground/10" />
          </>
        )}
        {v === 2 && (
          <>
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={50 + i * 60} y={24 + (i % 2) * 24} width="48" height="44" rx="8" className={i % 2 ? palettes[1] : palettes[0]} />
            ))}
            <circle cx="160" cy="92" r="16" className={palettes[2]} />
          </>
        )}
        {v === 3 && (
          <>
            <circle cx="90" cy="60" r="34" className={palettes[0]} />
            <rect x="140" y="30" width="130" height="14" rx="7" className={palettes[2]} />
            <rect x="140" y="54" width="100" height="14" rx="7" className={palettes[2]} />
            <rect x="140" y="78" width="120" height="14" rx="7" className={palettes[1]} />
          </>
        )}
      </svg>
    </div>
  );
}

export function Modal({ open, onClose, title, children, width = "max-w-md" }: { open: boolean; onClose: () => void; title: string; children: ReactNode; width?: string }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4 backdrop-blur-[2px]" onClick={onClose}>
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className={cn("w-full rounded-2xl border bg-card p-6 shadow-2xl", width)}
          >
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                <X className="size-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Toast({ text }: { text: string }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} role="status" className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-xl">
          {text}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export const field = "h-10 w-full rounded-xl border bg-background px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-primary";
export const btn = "inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-all active:scale-[0.98]";
export const btnPrimary = `${btn} bg-primary text-primary-foreground hover:opacity-90`;
export const btnGhost = `${btn} border bg-card hover:bg-muted`;
