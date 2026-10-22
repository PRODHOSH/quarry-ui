"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, ShoppingBag, Truck, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type CartLine = { id: string; name: string; variant?: string; price: number; qty: number; image?: string };

const DEFAULT_LINES: CartLine[] = [
  { id: "1", name: "Linen overshirt", variant: "Sand, M", price: 89, qty: 1, image: "https://picsum.photos/id/1011/200/200" },
  { id: "2", name: "Ceramic mug set", variant: "Set of two", price: 34, qty: 2, image: "https://picsum.photos/id/1060/200/200" },
];

/**
 * A slide over shopping cart. Quantities step up and down, lines can be removed, and a progress bar
 * shows how close the order is to free shipping. Control it with `open` and `onOpenChange`. Set
 * `contained` to keep it inside a relatively positioned parent instead of the whole screen.
 */
export function CartDrawer({
  open,
  onOpenChange,
  lines: initial = DEFAULT_LINES,
  freeShippingAt = 150,
  currency = "$",
  contained = false,
  onCheckout,
  className,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lines?: CartLine[];
  freeShippingAt?: number;
  currency?: string;
  contained?: boolean;
  onCheckout?: (lines: CartLine[]) => void;
  className?: string;
}) {
  const [lines, setLines] = useState(initial);
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const left = Math.max(0, freeShippingAt - subtotal);
  const pos = contained ? "absolute" : "fixed";
  const change = (id: string, d: number) => setLines((ls) => ls.flatMap((l) => (l.id === id ? (l.qty + d <= 0 ? [] : [{ ...l, qty: l.qty + d }]) : [l])));
  const money = (n: number) => `${currency}${n.toFixed(2).replace(/\.00$/, "")}`;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => onOpenChange(false)} className={cn(pos, "inset-0 z-40 bg-black/40 backdrop-blur-[2px]")} />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className={cn(pos, "right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col border-l bg-background shadow-2xl", className)}
          >
            <header className="flex items-center justify-between border-b px-5 py-4">
              <h2 className="text-lg font-semibold tracking-tight">Your cart <span className="text-sm font-normal text-muted-foreground">({lines.reduce((n, l) => n + l.qty, 0)})</span></h2>
              <button type="button" onClick={() => onOpenChange(false)} aria-label="Close cart" className="grid size-9 place-items-center rounded-full transition-colors hover:bg-muted"><X className="size-4" /></button>
            </header>

            {lines.length > 0 && (
              <div className="border-b px-5 py-3.5">
                <p className="flex items-center gap-2 text-sm">
                  <Truck className="size-4 text-muted-foreground" />
                  {left > 0 ? <>Add <b>{money(left)}</b> more for free shipping</> : <b>You have free shipping</b>}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div animate={{ width: `${Math.min(100, (subtotal / freeShippingAt) * 100)}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-primary" />
                </div>
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto px-5">
              {lines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground"><ShoppingBag className="size-6" /></span>
                    <p className="mt-4 font-semibold">Your cart is empty</p>
                    <p className="mt-1 text-sm text-muted-foreground">Things you add will show up here.</p>
                    <button type="button" onClick={() => onOpenChange(false)} className="mt-5 rounded-full border px-5 py-2 text-sm font-medium transition-colors hover:bg-muted">Keep browsing</button>
                  </div>
                </div>
              ) : (
                <ul className="divide-y">
                  <AnimatePresence initial={false}>
                    {lines.map((l) => (
                      <motion.li key={l.id} layout exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex gap-4 overflow-hidden py-4">
                        {l.image && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={l.image} alt="" className="size-20 shrink-0 rounded-xl border object-cover" />
                        )}
                        <div className="flex min-w-0 flex-1 flex-col">
                          <div className="flex justify-between gap-3"><p className="truncate text-sm font-medium">{l.name}</p><p className="text-sm font-semibold tabular-nums">{money(l.price * l.qty)}</p></div>
                          {l.variant && <p className="text-xs text-muted-foreground">{l.variant}</p>}
                          <div className="mt-auto flex items-center justify-between pt-2">
                            <div className="flex items-center rounded-full border">
                              <button type="button" aria-label="Decrease quantity" onClick={() => change(l.id, -1)} className="grid size-8 place-items-center rounded-full transition-colors hover:bg-muted"><Minus className="size-3.5" /></button>
                              <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                              <button type="button" aria-label="Increase quantity" onClick={() => change(l.id, 1)} className="grid size-8 place-items-center rounded-full transition-colors hover:bg-muted"><Plus className="size-3.5" /></button>
                            </div>
                            <button type="button" onClick={() => setLines((ls) => ls.filter((x) => x.id !== l.id))} className="text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground">Remove</button>
                          </div>
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              )}
            </div>

            {lines.length > 0 && (
              <footer className="border-t px-5 py-4">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-semibold tabular-nums">{money(subtotal)}</span></div>
                <p className="mt-1 text-xs text-muted-foreground">Taxes and shipping are worked out at checkout.</p>
                <button type="button" onClick={() => onCheckout?.(lines)} className="mt-4 h-12 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground transition-transform active:scale-[0.98]">Checkout</button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
