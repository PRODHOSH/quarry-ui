"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AtSign, Globe, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

type Member = { name: string; role: string; bio: string; image?: string };

const TEAM: Member[] = [
  { image: "https://randomuser.me/api/portraits/women/44.jpg", name: "Imani Clarke", role: "Co-founder, Design", bio: "Fifteen years shaping interfaces people forget they are using." },
  { image: "https://randomuser.me/api/portraits/men/32.jpg", name: "Rafael Costa", role: "Co-founder, Engineering", bio: "Builds the fast, boring infrastructure everything else relies on." },
  { image: "https://randomuser.me/api/portraits/women/68.jpg", name: "Yuki Sato", role: "Motion Designer", bio: "Believes a good transition should feel inevitable, never decorative." },
  { image: "https://randomuser.me/api/portraits/men/75.jpg", name: "Elias Berg", role: "Developer Advocate", bio: "Writes the docs he always wished existed." },
];

const HUES = [
  "from-primary/35 via-primary/10 to-muted",
  "from-muted via-primary/10 to-primary/35",
  "from-primary/25 via-muted to-primary/10",
  "from-muted via-primary/15 to-primary/30",
];

/**
 * Team portraits that reveal a short bio and social links on hover. The portrait area is a
 * generated gradient with initials, so swap in a photo with an <img> and nothing else changes.
 */
export function TeamCards({ team = TEAM, className }: { team?: Member[]; className?: string }) {
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div className={cn("mx-auto grid w-full max-w-4xl grid-cols-2 gap-4 lg:grid-cols-4", className)}>
      {team.map((m, i) => {
        const on = hover === i;
        return (
          <motion.article
            key={m.name}
            onHoverStart={() => setHover(i)}
            onHoverEnd={() => setHover(null)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(null)}
            tabIndex={0}
            animate={{ opacity: hover === null || on ? 1 : 0.55 }}
            transition={{ duration: 0.25 }}
            className="group relative aspect-[3/4] overflow-hidden rounded-2xl border bg-card outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            {!m.image && <div className={cn("absolute inset-0 bg-gradient-to-br", HUES[i % HUES.length])} />}
            {m.image ? (
              <motion.img
                src={m.image}
                alt={m.name}
                loading="lazy"
                animate={{ scale: on ? 1.06 : 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 26 }}
                className="absolute inset-0 size-full object-cover"
              />
            ) : (
              <motion.span
                animate={{ scale: on ? 1.08 : 1, y: on ? -18 : 0 }}
                transition={{ type: "spring", stiffness: 220, damping: 24 }}
                className="absolute inset-0 grid place-items-center text-6xl font-semibold tracking-tighter text-foreground/80"
              >
                {m.name.split(" ").map((w) => w[0]).join("")}
              </motion.span>
            )}

            <motion.div
              animate={{ y: on ? 0 : "62%" }}
              transition={{ type: "spring", stiffness: 260, damping: 28 }}
              className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-card/95 p-4 backdrop-blur"
            >
              <h3 className="text-sm font-semibold">{m.name}</h3>
              <p className="text-xs text-muted-foreground">{m.role}</p>
              <motion.div animate={{ opacity: on ? 1 : 0 }} transition={{ duration: 0.2 }}>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{m.bio}</p>
                <div className="mt-3 flex gap-1.5">
                  {[AtSign, Globe, Mail].map((Icon, n) => (
                    <a key={n} href="#" aria-label="Social link" className="grid size-7 place-items-center rounded-lg border bg-background text-muted-foreground transition-colors hover:text-foreground">
                      <Icon className="size-3.5" />
                    </a>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.article>
        );
      })}
    </div>
  );
}
