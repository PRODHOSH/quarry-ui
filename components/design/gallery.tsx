"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Search } from "lucide-react";
import { BookmarkButton } from "@/components/auth/bookmark-button";
import { cn } from "@/lib/utils";

type Card = { slug: string; name: string; category: string; tagline: string; swatch: string[]; fonts: string[] };

/** The browsable grid of DESIGN.md files: search, category chips and palette-strip cards. */
export function DesignGallery({ cards, categories }: { cards: Card[]; categories: string[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return cards.filter((c) => (cat === "All" || c.category === cat) && (!s || `${c.name} ${c.tagline} ${c.category}`.toLowerCase().includes(s)));
  }, [cards, q, cat]);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${cards.length} design files`}
            aria-label="Search design files"
            className="h-10 w-full rounded-full border bg-card pl-10 pr-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-foreground/40"
          />
        </div>
        <p className="text-sm text-muted-foreground tabular-nums">{shown.length} of {cards.length}</p>
      </div>

      <div className="-mx-1 mt-4 flex flex-wrap gap-1.5">
        {["All", ...categories].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn("relative rounded-full px-3.5 py-1.5 text-sm transition-colors", cat === c ? "text-background" : "text-muted-foreground hover:text-foreground")}
          >
            {cat === c && <motion.span layoutId="design-cat" className="absolute inset-0 rounded-full bg-foreground" transition={{ type: "spring", stiffness: 420, damping: 34 }} />}
            <span className="relative">{c}</span>
          </button>
        ))}
      </div>

      <motion.ul layout className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {shown.map((c) => (
            <motion.li key={c.slug} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }}>
              <Link href={`/design/${c.slug}`} className="group block rounded-2xl border bg-card p-4 transition-colors hover:border-foreground/30">
                {c.swatch.length > 0 && (
                  <div className="mb-4 flex h-24 overflow-hidden rounded-xl border">
                    {c.swatch.map((hex, i) => (
                      <span key={hex + i} className="h-full flex-1 transition-all duration-300 group-hover:first:flex-[1.6]" style={{ background: hex }} />
                    ))}
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold tracking-tight">{c.name}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{c.category}</p>
                  </div>
                  <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
                  <BookmarkButton kind="design" slug={c.slug} className="absolute right-6 top-6 size-8 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 [&_svg]:size-3.5" />
                </div>
                <p className="mt-2 line-clamp-2 min-h-[2.5rem] text-sm leading-relaxed text-muted-foreground">{c.tagline}</p>
                {c.fonts.length > 0 && <p className="mt-3 truncate font-mono text-[11px] text-muted-foreground/70">{c.fonts.join("  ·  ")}</p>}
              </Link>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      {shown.length === 0 && (
        <div className="mt-16 text-center text-sm text-muted-foreground">
          Nothing matches “{q}”.{" "}
          <button onClick={() => { setQ(""); setCat("All"); }} className="text-foreground underline underline-offset-4">Clear filters</button>
        </div>
      )}
    </div>
  );
}
