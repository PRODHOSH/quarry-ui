"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Mark } from "@/components/site/mark";
import { AGENT_ICONS } from "@/components/site/agent-icons";
import AntigravityIcon from "@thesvg/react/google-antigravity";
import { cn } from "@/lib/utils";

const EASE = [0.32, 0.72, 0, 1] as const;

/** A bento cell. A soft spotlight follows the cursor across its border and surface. */
function Cell({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: EASE }}
      onPointerMove={(e) => {
        const r = ref.current!.getBoundingClientRect();
        ref.current!.style.setProperty("--mx", `${e.clientX - r.left}px`);
        ref.current!.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn("group relative overflow-hidden rounded-3xl border bg-card/50 p-7 sm:p-8", className)}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: "radial-gradient(360px circle at var(--mx,50%) var(--my,50%), color-mix(in oklab, var(--brand) 14%, transparent), transparent 70%)" }}
      />
      <div className="relative flex h-full flex-col">{children}</div>
    </motion.div>
  );
}

const Title = ({ children }: { children: React.ReactNode }) => <h3 className="text-xl font-semibold tracking-tight sm:text-2xl">{children}</h3>;
const Body = ({ children }: { children: React.ReactNode }) => <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{children}</p>;

/** A ring that draws itself around the count. */
function Ring({ value }: { value: string }) {
  return (
    <div className="relative grid size-44 place-items-center sm:size-52">
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90">
        <circle cx="50" cy="50" r="44" fill="none" stroke="var(--border)" strokeWidth="2" />
        <motion.circle
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2.5"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 0.82 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: EASE, delay: 0.2 }}
        />
      </svg>
      <div className="text-center">
        <p className="text-6xl font-semibold tracking-[-0.05em] sm:text-7xl">{value}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">components</p>
      </div>
    </div>
  );
}

const TOOLS = [
  { n: "Claude Code", i: AGENT_ICONS["claude-code"]("size-4") },
  { n: "Cursor", i: AGENT_ICONS["cursor"]("size-4") },
  { n: "Antigravity", i: <AntigravityIcon className="size-4" /> },
  { n: "Codex", i: AGENT_ICONS["codex"]("size-4") },
  { n: "v0", i: AGENT_ICONS["v0"]("size-4") },
  { n: "Lovable", i: AGENT_ICONS["lovable"]("size-4") },
];

/** What the product is, in plain words, before any mechanics. */
export function WhatIs({ total, sections }: { total: number; sections: number }) {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="max-w-3xl">
        <p className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted-foreground">What is Quarry</p>
        <h2 className="mt-5 text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.05em] sm:text-6xl">
          Better material for what <Mark>your AI builds.</Mark>
        </h2>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground">
          AI tools write pages fast, but they all draw from the same generic parts. Quarry is a free library of clean React components, plus the prompt that gets each one into your project.
        </p>
      </div>

      <div className="mt-14 grid gap-4 md:grid-cols-12">
        <Cell className="items-center md:col-span-5 md:row-span-2">
          <div className="flex h-full flex-col items-center justify-between gap-8 text-center">
            <Ring value={String(total)} />
            <div>
              <Title>Real components you own</Title>
              <Body>
                {sections} full page sections and the rest are elements and loaders. Each installs as plain source in your repo. No package to depend on.
              </Body>
            </div>
          </div>
        </Cell>

        <Cell className="md:col-span-7">
          <Title>A prompt for every AI tool</Title>
          <Body>Terminal agents get the install command. Chat builders get the source. Copy the one written for your tool.</Body>
          <ul className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TOOLS.map((t, i) => (
              <motion.li
                key={t.n}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.5, ease: EASE }}
                className="flex items-center gap-2.5 rounded-xl border bg-background px-3 py-2.5 text-sm"
              >
                {t.i}
                {t.n}
              </motion.li>
            ))}
          </ul>
        </Cell>

        <Cell className="md:col-span-3">
          <div className="rounded-xl border bg-background p-3 font-mono text-[11px] leading-relaxed text-muted-foreground">
            <p className="text-foreground">feature-bento.tsx</p>
            {[62, 88, 48, 74, 36].map((w, i) => (
              <motion.span
                key={i}
                className="mt-1.5 block h-1.5 origin-left rounded-full bg-border"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.7, ease: EASE }}
                style={{ width: `${w}%` }}
              />
            ))}
          </div>
          <div className="mt-6">
            <Title>One file each</Title>
            <Body>Edit it however you like.</Body>
          </div>
        </Cell>

        <Cell className="md:col-span-4">
          <div className="flex gap-2" aria-hidden>
            {["background", "card", "muted", "primary", "brand"].map((c, i) => (
              <motion.span
                key={c}
                initial={{ scale: 0.6, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 + i * 0.07, duration: 0.5, ease: EASE }}
                className="size-10 rounded-full border transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-1"
                style={{ background: c === "brand" ? "var(--brand)" : `var(--${c})` }}
              />
            ))}
          </div>
          <div className="mt-6">
            <Title>Matches your app on day one</Title>
            <Body>Components read your shadcn tokens, so your colors, radius and dark mode apply with nothing hard-coded.</Body>
          </div>
        </Cell>
      </div>
    </div>
  );
}
