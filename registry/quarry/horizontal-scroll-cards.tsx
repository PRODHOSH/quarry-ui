"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Project = { name: string; category: string; description: string; image: string; href?: string };

const PROJECTS: Project[] = [
  { name: "Enterprise Platform", category: "B2B SaaS", description: "Real-time analytics, user management and automated reporting at scale.", image: "https://picsum.photos/id/1015/800/600" },
  { name: "AI Copilot", category: "Artificial intelligence", description: "Contextual suggestions for developers while they write.", image: "https://picsum.photos/id/1018/800/600" },
  { name: "Commerce OS", category: "Platform", description: "A headless commerce system with multi-tenant architecture and clean APIs.", image: "https://picsum.photos/id/1043/800/600" },
  { name: "Finance App", category: "Mobile", description: "Personal finance and investing, designed for the phone first.", image: "https://picsum.photos/id/1036/800/600" },
  { name: "Field Notes", category: "Editorial", description: "A quiet reading app for long form writing and research.", image: "https://picsum.photos/id/1039/800/600" },
];

/**
 * Vertical scroll inside this component drives the horizontal movement of the cards. Each card is a
 * photo, a short description and a quiet link. A thin progress line shows how far along you are.
 */
export function HorizontalScrollCards({
  eyebrow = "Selected work",
  title = "Featured projects",
  hint = "Scroll to explore",
  projects = PROJECTS,
  className,
}: {
  eyebrow?: string;
  title?: string;
  hint?: string;
  projects?: Project[];
  className?: string;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const { scrollYProgress } = useScroll({ container: scroller });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const rangeValue = useMotionValue(0);
  const x = useTransform([smooth, rangeValue], ([p, r]) => -(p as number) * (r as number));
  const bar = useTransform(smooth, (p) => `${Math.max(4, p * 100)}%`);

  useEffect(() => {
    const measure = () => {
      if (!track.current || !scroller.current) return;
      const next = Math.max(0, track.current.scrollWidth - scroller.current.clientWidth);
      setRange(next);
      rangeValue.set(next);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [rangeValue]);

  return (
    <div ref={scroller} className={cn("h-[34rem] w-full overflow-y-auto scrollbar-none", className)}>
      <div style={{ height: `calc(100% + ${range}px)` }} className="relative">
        <div className="sticky top-0 flex h-[34rem] flex-col justify-center overflow-hidden">
          <div className="mb-8 flex items-end justify-between gap-6 px-8">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
              <h2 className="mt-1.5 text-3xl font-semibold tracking-tight">{title}</h2>
            </div>
            <p className="hidden text-sm text-muted-foreground sm:block">{hint}</p>
          </div>

          <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-8">
            {projects.map((p, i) => (
              <a key={p.name} href={p.href ?? "#"} className="group block w-[19rem] shrink-0">
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.image} alt={p.name} loading="lazy" className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-background/90 px-3 py-1 text-[11px] font-medium text-foreground backdrop-blur">{p.category}</span>
                  <span className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-background text-foreground opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 translate-y-1">
                    <ArrowUpRight className="size-4" />
                  </span>
                </div>
                <div className="mt-4 flex items-baseline justify-between gap-3">
                  <h3 className="text-lg font-semibold tracking-tight">{p.name}</h3>
                  <span className="text-xs tabular-nums text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
              </a>
            ))}
          </motion.div>

          <div className="mx-8 mt-8 h-px overflow-hidden rounded-full bg-border">
            <motion.div style={{ width: bar }} className="h-full bg-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}
