"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

type Snippet = { label: string; code: string };

const SNIPPETS: Snippet[] = [
  { label: "npm", code: "npx shadcn@latest add https://quarry-ui.com/r/dock.json" },
  { label: "pnpm", code: "pnpm dlx shadcn@latest add https://quarry-ui.com/r/dock.json" },
  { label: "yarn", code: "yarn dlx shadcn@latest add https://quarry-ui.com/r/dock.json" },
  { label: "bun", code: "bunx --bun shadcn@latest add https://quarry-ui.com/r/dock.json" },
];

/**
 * A command block with package manager tabs. The active tab slides under a shared highlight, the
 * command swaps with a short fade, and the copy button confirms with a checkmark.
 */
export function CodeTabs({ snippets = SNIPPETS, className }: { snippets?: Snippet[]; className?: string }) {
  const [i, setI] = useState(0);
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippets[i].code);
    } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className={cn("w-full max-w-xl overflow-hidden rounded-2xl border bg-card", className)}>
      <div className="flex items-center justify-between border-b px-3 py-2">
        <div role="tablist" className="flex gap-1">
          {snippets.map((s, n) => (
            <button
              key={s.label}
              role="tab"
              aria-selected={n === i}
              onClick={() => setI(n)}
              className={cn("relative rounded-lg px-3 py-1 font-mono text-xs transition-colors", n === i ? "text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              {n === i && <motion.span layoutId="code-tab" className="absolute inset-0 rounded-lg bg-muted" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
              <span className="relative">{s.label}</span>
            </button>
          ))}
        </div>
        <button onClick={copy} aria-label="Copy command" className="relative grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={String(copied)} initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }} transition={{ duration: 0.15 }}>
              {copied ? <Check className="size-4 text-primary" /> : <Copy className="size-4" />}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <div className="overflow-x-auto px-4 py-4">
        <AnimatePresence mode="wait" initial={false}>
          <motion.pre key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="font-mono text-[13px] leading-relaxed">
            <span className="select-none text-muted-foreground">$ </span>
            {snippets[i].code}
          </motion.pre>
        </AnimatePresence>
      </div>
    </div>
  );
}
