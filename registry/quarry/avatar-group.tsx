"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Person = { name: string; role?: string; src?: string };

const PEOPLE: Person[] = [
  { name: "Ava Lindqvist", role: "Design" },
  { name: "Marcus Bell", role: "Engineering" },
  { name: "Noor Haddad", role: "Product" },
  { name: "Hiro Tanaka", role: "Research" },
  { name: "Isla Moreau", role: "Marketing" },
  { name: "Theo Grant", role: "Support" },
  { name: "Zara Khan", role: "Finance" },
];

const TINTS = ["bg-primary text-primary-foreground", "bg-foreground text-background", "bg-foreground/70 text-background", "bg-primary/65 text-primary-foreground"];

/**
 * Overlapping avatars for "who is here". Hovering lifts one with a spring and shows a tooltip that
 * follows between people, and anything beyond `max` collapses into a +N chip.
 */
export function AvatarGroup({ people = PEOPLE, max = 5, size = 44, className }: { people?: Person[]; max?: number; size?: number; className?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;

  return (
    <div className={cn("flex items-center", className)}>
      {shown.map((p, i) => (
        <div key={p.name} className="relative -ml-3 first:ml-0" style={{ zIndex: hover === i ? 50 : shown.length - i }} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)}>
          <AnimatePresence>
            {hover === i && (
              <motion.div
                initial={{ opacity: 0, y: 6, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.9 }}
                transition={{ duration: 0.16 }}
                className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-foreground px-2.5 py-1.5 text-center text-background shadow-lg"
              >
                <span className="block text-xs font-medium leading-none">{p.name}</span>
                {p.role && <span className="mt-1 block text-[10px] leading-none opacity-65">{p.role}</span>}
              </motion.div>
            )}
          </AnimatePresence>
          <motion.button
            animate={{ y: hover === i ? -6 : 0, scale: hover === i ? 1.12 : 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 24 }}
            style={{ width: size, height: size }}
            aria-label={p.name}
            className={cn("grid place-items-center overflow-hidden rounded-full border-2 border-background text-xs font-semibold", TINTS[i % TINTS.length])}
          >
            {p.src ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.src} alt={p.name} className="size-full object-cover" />
            ) : (
              p.name.split(" ").map((w) => w[0]).join("")
            )}
          </motion.button>
        </div>
      ))}
      {rest > 0 && (
        <div style={{ width: size, height: size }} className="-ml-3 grid place-items-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground">
          +{rest}
        </div>
      )}
    </div>
  );
}
