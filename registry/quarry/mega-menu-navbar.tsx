"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, ChevronDown, FileText, LifeBuoy, Plug, Shield, Sparkles, Users } from "lucide-react";
import { cn } from "@/lib/utils";

type Entry = { icon: ReactNode; title: string; text: string };
type Menu = { id: string; label: string; entries: Entry[] };

const MENUS: Menu[] = [
  {
    id: "product",
    label: "Product",
    entries: [
      { icon: <Sparkles />, title: "Assistant", text: "Draft, summarise and automate with context." },
      { icon: <BarChart3 />, title: "Analytics", text: "Understand what people actually do." },
      { icon: <Plug />, title: "Integrations", text: "Connect the tools your team already uses." },
      { icon: <Shield />, title: "Security", text: "SSO, audit logs and granular roles." },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    entries: [
      { icon: <FileText />, title: "Documentation", text: "Guides, references and recipes." },
      { icon: <Users />, title: "Community", text: "Ask questions, share what you built." },
      { icon: <LifeBuoy />, title: "Support", text: "Talk to a human within the hour." },
    ],
  },
];

/**
 * A navbar with a mega menu. One shared panel glides between triggers and resizes to fit its
 * content, so moving along the bar feels like a single surface instead of several popups.
 */
export function MegaMenuNavbar({ brand = "Northwind", className }: { brand?: string; className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const menu = MENUS.find((m) => m.id === active);
  const index = MENUS.findIndex((m) => m.id === active);

  return (
    <div className={cn("relative w-full max-w-3xl", className)} onMouseLeave={() => setActive(null)}>
      <header className="relative z-10 flex items-center justify-between rounded-2xl border bg-card/90 px-4 py-2.5 backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className="grid size-6 place-items-center rounded-md bg-primary text-xs text-primary-foreground">{brand[0]}</span>
          {brand}
        </div>
        <nav className="flex items-center gap-1" onKeyDown={(e) => e.key === "Escape" && setActive(null)}>
          {MENUS.map((m) => (
            <button
              key={m.id}
              onMouseEnter={() => setActive(m.id)}
              onFocus={() => setActive(m.id)}
              aria-expanded={active === m.id}
              className={cn(
                "flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm transition-colors",
                active === m.id ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
              <ChevronDown className={cn("size-3.5 transition-transform", active === m.id && "rotate-180")} />
            </button>
          ))}
          <a href="#" onMouseEnter={() => setActive(null)} className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">Pricing</a>
        </nav>
        <a href="#" className="rounded-lg bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground transition-transform active:scale-95">Get started</a>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="absolute left-0 right-0 top-full z-0 mt-2 origin-top overflow-hidden rounded-2xl border bg-card p-2 shadow-2xl"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.ul
                key={menu.id}
                initial={{ opacity: 0, x: index === 0 ? -16 : 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: index === 0 ? 16 : -16 }}
                transition={{ duration: 0.2 }}
                className="grid gap-1 sm:grid-cols-2"
              >
                {menu.entries.map((e) => (
                  <li key={e.title}>
                    <a href="#" className="group flex gap-3 rounded-xl p-3 transition-colors hover:bg-muted">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg border bg-background text-muted-foreground transition-colors group-hover:text-primary [&_svg]:size-4">{e.icon}</span>
                      <span>
                        <span className="block text-sm font-medium">{e.title}</span>
                        <span className="block text-xs leading-relaxed text-muted-foreground">{e.text}</span>
                      </span>
                    </a>
                  </li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
