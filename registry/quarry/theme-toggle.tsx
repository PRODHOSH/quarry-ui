"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * A light and dark switch with a sliding thumb and an icon that spins between sun and moon. It is
 * controlled by `checked` and `onCheckedChange` (true means dark), and works uncontrolled too. Wire
 * it to your theme provider in `onCheckedChange`.
 */
export function ThemeToggle({
  checked,
  defaultChecked = true,
  onCheckedChange,
  className,
}: {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (dark: boolean) => void;
  className?: string;
}) {
  const [inner, setInner] = useState(defaultChecked);
  const dark = checked ?? inner;
  const set = (v: boolean) => {
    setInner(v);
    onCheckedChange?.(v);
  };

  return (
    <button
      role="switch"
      aria-checked={dark}
      aria-label="Toggle dark mode"
      onClick={() => set(!dark)}
      className={cn("relative flex h-10 w-[4.5rem] items-center overflow-hidden rounded-full border p-1 transition-colors duration-500", dark ? "bg-muted" : "bg-primary/25", className)}
    >
      {/* stars and clouds in the track */}
      <motion.span animate={{ opacity: dark ? 1 : 0, y: dark ? 0 : 8 }} className="absolute left-3 top-2 size-0.5 rounded-full bg-foreground/70 shadow-[10px_8px_0_0_var(--foreground),4px_14px_0_0_var(--muted-foreground)]" />
      <motion.span animate={{ opacity: dark ? 0 : 1, y: dark ? -8 : 0 }} className="absolute bottom-1.5 right-3 h-1.5 w-5 rounded-full bg-background/80" />
      <motion.span
        animate={{ x: dark ? 32 : 0 }}
        transition={{ type: "spring", stiffness: 420, damping: 28 }}
        className="relative z-10 grid size-8 place-items-center rounded-full bg-card text-foreground shadow-md"
      >
        <motion.span key={String(dark)} initial={{ rotate: -90, scale: 0.4, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ duration: 0.3 }}>
          {dark ? <Moon className="size-4" /> : <Sun className="size-4 text-primary" />}
        </motion.span>
      </motion.span>
    </button>
  );
}
