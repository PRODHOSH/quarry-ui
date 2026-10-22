"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, Phone, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ChatChannel = { label: string; hint: string; href: string; icon: "chat" | "mail" | "phone" };

const CHANNELS: ChatChannel[] = [
  { label: "Chat with us", hint: "Usually replies in minutes", href: "#", icon: "chat" },
  { label: "Email support", hint: "hello@example.com", href: "mailto:hello@example.com", icon: "mail" },
  { label: "Call the team", hint: "Mon to Fri, 9 to 6", href: "tel:+10000000000", icon: "phone" },
];
const ICON = { chat: MessageCircle, mail: Mail, phone: Phone };

/**
 * A floating help button. It pulses softly to say someone is around, opens a small menu of ways to
 * get in touch, and closes with Escape or a click elsewhere. `contained` keeps it inside a
 * relatively positioned parent instead of the corner of the screen.
 */
export function FloatingChat({ channels = CHANNELS, title = "Need a hand?", contained = false, className }: { channels?: ChatChannel[]; title?: string; contained?: boolean; className?: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn(contained ? "absolute" : "fixed", "bottom-5 right-5 z-40 flex flex-col items-end gap-3", className)} onKeyDown={(e) => e.key === "Escape" && setOpen(false)}>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 8, scale: 0.96 }} transition={{ duration: 0.18 }} className="w-72 origin-bottom-right overflow-hidden rounded-2xl border bg-card shadow-2xl">
            <div className="bg-primary px-4 py-3.5 text-primary-foreground">
              <p className="font-semibold">{title}</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-xs opacity-80"><span className="size-1.5 rounded-full bg-current" /> We are online</p>
            </div>
            <ul className="p-1.5">
              {channels.map((c, i) => {
                const Icon = ICON[c.icon];
                return (
                  <motion.li key={c.label} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.05 }}>
                    <a href={c.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted">
                      <span className="grid size-9 place-items-center rounded-full border bg-background"><Icon className="size-4" /></span>
                      <span className="leading-tight"><span className="block text-sm font-medium">{c.label}</span><span className="block text-xs text-muted-foreground">{c.hint}</span></span>
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
      <button type="button" aria-expanded={open} aria-label={open ? "Close help menu" : "Open help menu"} onClick={() => setOpen((o) => !o)} className="relative grid size-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-xl transition-transform hover:scale-105 active:scale-95">
        {!open && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-primary/40 [animation-duration:2.6s]" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={String(open)} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.16 }} className="relative flex">
            {open ? <X className="size-6" /> : <MessageCircle className="size-6" />}
          </motion.span>
        </AnimatePresence>
      </button>
    </div>
  );
}
