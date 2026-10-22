"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

/** Copies the full DESIGN.md text. The file is fetched on click so it never bloats the page. */
export function CopyDesign({ slug, className }: { slug: string; className?: string }) {
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      const text = await fetch(`/design-md/${slug}.md`).then((r) => r.text());
      await navigator.clipboard.writeText(text);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {}
  };

  return (
    <button
      type="button"
      onClick={copy}
      className={cn("inline-flex h-10 items-center gap-2 rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform active:scale-95", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span key={String(done)} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.14 }} className="flex items-center gap-2">
          {done ? <Check className="size-4" /> : <Copy className="size-4" />}
          {done ? "Copied" : "Copy DESIGN.md"}
        </motion.span>
      </AnimatePresence>
    </button>
  );
}

/** A small hex chip that copies its value. */
export function CopyHex({ hex, children, className, style }: { hex: string; children?: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        try { await navigator.clipboard.writeText(hex); } catch {}
        setDone(true);
        setTimeout(() => setDone(false), 1100);
      }}
      title={done ? "Copied" : `Copy ${hex}`}
      className={className}
      style={style}
    >
      {done ? <span className="rounded bg-black/70 px-1.5 py-0.5 text-[11px] text-white">Copied</span> : children}
    </button>
  );
}
