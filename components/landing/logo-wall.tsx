"use client";

import { motion } from "framer-motion";
import { AGENT_ICONS } from "@/components/site/agent-icons";
import AntigravityIcon from "@thesvg/react/google-antigravity";

const EASE = [0.23, 1, 0.32, 1] as const;

type Tool = { id: string; name: string; tag: string; glow: string; icon: React.ReactNode };

const FEATURED: Tool[] = [
  { id: "claude-code", name: "Claude Code", tag: "Terminal agent", glow: "217,119,87", icon: AGENT_ICONS["claude-code"]("size-full") },
  { id: "cursor", name: "Cursor", tag: "AI code editor", glow: "180,180,190", icon: AGENT_ICONS["cursor"]("size-full") },
  { id: "antigravity", name: "Antigravity", tag: "Agentic IDE", glow: "109,141,255", icon: <AntigravityIcon className="size-full" /> },
  { id: "codex", name: "Codex", tag: "CLI agent", glow: "16,163,127", icon: AGENT_ICONS["codex"]("size-full") },
];

const ALSO: Tool[] = [
  { id: "lovable", name: "Lovable", tag: "", glow: "", icon: AGENT_ICONS["lovable"]("size-full") },
  { id: "v0", name: "v0", tag: "", glow: "", icon: AGENT_ICONS["v0"]("size-full") },
  { id: "bolt", name: "bolt.new", tag: "", glow: "", icon: AGENT_ICONS["bolt"]("size-full") },
  { id: "replit", name: "Replit", tag: "", glow: "", icon: AGENT_ICONS["replit"]("size-full") },
];

export function LogoWall() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <p className="mb-8 text-center text-sm font-normal text-muted-foreground">
        One prompt, tuned for the tools you already build with
      </p>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED.map((tool, i) => (
          <motion.li
            key={tool.id}
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.8, delay: i * 0.08, ease: EASE }}
            whileHover={{ y: -6 }}
            className="group relative overflow-hidden rounded-2xl border bg-card/40 p-6 transition-colors hover:border-foreground/25"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute -right-10 -top-10 size-44 rounded-full opacity-30 blur-3xl transition-opacity duration-500 group-hover:opacity-70"
              style={{ background: `rgb(${tool.glow})` }}
            />
            <span className="relative grid size-16 place-items-center rounded-2xl border bg-background p-3.5 transition-transform duration-500 [transition-timing-function:var(--ease-out)] group-hover:scale-110 group-hover:-rotate-3">
              {tool.icon}
            </span>
            <p className="relative mt-6 text-xl font-semibold tracking-tight">{tool.name}</p>
            <p className="relative mt-1 text-sm font-normal text-muted-foreground">{tool.tag}</p>
          </motion.li>
        ))}
      </ul>

      <div className="mt-8 flex items-center justify-center gap-x-10 gap-y-4 overflow-hidden text-sm font-normal text-muted-foreground">
        <span className="shrink-0">and</span>
        <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {ALSO.map((tool) => (
            <li
              key={tool.id}
              className="flex items-center gap-2.5 text-base font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              <span className="size-5">{tool.icon}</span>
              {tool.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
