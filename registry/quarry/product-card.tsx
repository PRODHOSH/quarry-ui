"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Heart, Plus, Star } from "lucide-react";
import { cn } from "@/lib/utils";

export type Product = { name: string; price: number; was?: number; rating?: number; reviews?: number; badge?: string; image: string; hover?: string };

const PRODUCTS: Product[] = [
  { name: "Linen overshirt", price: 89, was: 120, rating: 4.8, reviews: 214, badge: "Save 26%", image: "https://picsum.photos/id/1011/700/860", hover: "https://picsum.photos/id/1012/700/860" },
  { name: "Ceramic mug set", price: 34, rating: 4.6, reviews: 98, image: "https://picsum.photos/id/1060/700/860", hover: "https://picsum.photos/id/1062/700/860" },
  { name: "Canvas weekender", price: 142, rating: 4.9, reviews: 56, badge: "New", image: "https://picsum.photos/id/1025/700/860", hover: "https://picsum.photos/id/1027/700/860" },
];

function Card({ p, currency }: { p: Product; currency: string }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  return (
    <article className="group">
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.image} alt={p.name} loading="lazy" className="absolute inset-0 size-full object-cover transition-opacity duration-500 group-hover:opacity-0" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.hover ?? p.image} alt="" loading="lazy" className="absolute inset-0 size-full scale-105 object-cover opacity-0 transition-all duration-700 group-hover:scale-100 group-hover:opacity-100" />
        {p.badge && <span className="absolute left-3 top-3 rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold">{p.badge}</span>}
        <button type="button" aria-pressed={liked} aria-label={liked ? "Remove from wishlist" : "Add to wishlist"} onClick={() => setLiked((l) => !l)} className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/90 shadow-sm backdrop-blur transition-transform hover:scale-110 active:scale-90">
          <motion.span key={String(liked)} initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 14 }} className="flex"><Heart className={cn("size-4", liked && "fill-primary text-primary")} /></motion.span>
        </button>
        <button
          type="button"
          onClick={() => { setAdded(true); setTimeout(() => setAdded(false), 1600); }}
          className="absolute inset-x-3 bottom-3 flex h-11 translate-y-3 items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground opacity-0 shadow-lg transition-all duration-300 focus-visible:translate-y-0 focus-visible:opacity-100 group-hover:translate-y-0 group-hover:opacity-100"
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.span key={String(added)} initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} transition={{ duration: 0.14 }} className="flex items-center gap-2">
              {added ? <><Check className="size-4" /> Added</> : <><Plus className="size-4" /> Quick add</>}
            </motion.span>
          </AnimatePresence>
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-medium">{p.name}</h3>
          {p.rating && <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground"><Star className="size-3 fill-foreground text-foreground" />{p.rating}<span>({p.reviews})</span></p>}
        </div>
        <p className="shrink-0 text-sm tabular-nums"><span className="font-semibold">{currency}{p.price}</span>{p.was && <span className="ml-1.5 text-muted-foreground line-through">{currency}{p.was}</span>}</p>
      </div>
    </article>
  );
}

/**
 * Store product cards. The photo swaps to a second angle on hover, a heart saves it, and a quick
 * add button slides up from the bottom and confirms in place. Pass `products` to use your own.
 */
export function ProductCard({ products = PRODUCTS, currency = "$", className }: { products?: Product[]; currency?: string; className?: string }) {
  return (
    <div className={cn("mx-auto grid w-full max-w-4xl gap-5 px-6 sm:grid-cols-3", className)}>
      {products.map((p) => <Card key={p.name} p={p} currency={currency} />)}
    </div>
  );
}
