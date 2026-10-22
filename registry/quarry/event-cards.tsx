"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export type EventItem = { title: string; date: string; place: string; image: string; status?: string; href?: string };

const EVENTS: EventItem[] = [
  { title: "Open Studio Night", date: "12 July, 7:00 pm", place: "Warehouse 9, Riverside", image: "https://picsum.photos/id/1043/900/900", status: "Selling fast" },
  { title: "Design and Coffee Morning", date: "3 August, 9:30 am", place: "The Roastery, Old Town", image: "https://picsum.photos/id/1060/900/900", status: "Almost full" },
  { title: "Autumn Showcase", date: "21 September, 6:00 pm", place: "Gallery Hall, Central", image: "https://picsum.photos/id/1039/900/900" },
];

/**
 * Cards for upcoming events. The poster starts in black and white and fills with colour on hover,
 * a status pill pulses for urgency, and the cards rise in one after another as they scroll into
 * view. Each card links wherever `href` points.
 */
export function EventCards({ events = EVENTS, cta = "Get tickets", className }: { events?: EventItem[]; cta?: string; className?: string }) {
  return (
    <div className={cn("mx-auto grid w-full max-w-5xl gap-6 px-6 md:grid-cols-3", className)}>
      {events.map((e, i) => (
        <motion.a
          key={e.title}
          href={e.href ?? "#"}
          initial={{ opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="group flex flex-col overflow-hidden rounded-3xl border bg-card transition-colors hover:border-foreground/30"
        >
          <div className="relative aspect-square overflow-hidden bg-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={e.image} alt="" loading="lazy" className="size-full object-cover grayscale transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0" />
            {e.status && (
              <span className="absolute left-3 top-3 inline-flex items-center gap-2 rounded-full bg-background px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider">
                <span className="size-1.5 animate-pulse rounded-full bg-primary" /> {e.status}
              </span>
            )}
          </div>
          <div className="flex flex-1 flex-col p-5">
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-muted-foreground"><Calendar className="size-3.5" /> {e.date}</p>
            <h3 className="mt-2.5 text-xl font-semibold leading-snug tracking-tight">{e.title}</h3>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-muted-foreground"><MapPin className="size-3.5 shrink-0" /> {e.place}</p>
            <span className="mt-auto flex items-center gap-2 border-t pt-4 text-sm font-semibold">
              <span className="mt-4">{cta}</span>
              <ArrowRight className="mt-4 size-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </span>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
