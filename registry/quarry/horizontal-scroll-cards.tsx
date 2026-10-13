"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Bot, Building2, ShoppingBag, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";

type Project = {
  name: string;
  category: string;
  description: string;
  icon: ReactNode;
  tint: string;
};

const PROJECTS: Project[] = [
  { name: "Enterprise Platform", category: "B2B SaaS", description: "Real-time analytics, user management and automated reporting at scale.", icon: <Building2 className="size-8" />, tint: "from-chart-1/25 to-chart-1/5 text-chart-1" },
  { name: "AI Copilot", category: "Artificial intelligence", description: "An assistant that gives developers contextual suggestions while they write.", icon: <Bot className="size-8" />, tint: "from-chart-4/25 to-chart-4/5 text-chart-4" },
  { name: "Commerce OS", category: "Platform", description: "A headless commerce system with multi-tenant architecture and clean APIs.", icon: <ShoppingBag className="size-8" />, tint: "from-chart-3/25 to-chart-3/5 text-chart-3" },
  { name: "Finance App", category: "Mobile", description: "Personal finance and investment tracking designed for the phone first.", icon: <Wallet className="size-8" />, tint: "from-chart-2/25 to-chart-2/5 text-chart-2" },
];

/** Vertical scroll inside this component drives the horizontal movement of the cards. */
export function HorizontalScrollCards({ className }: { className?: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState(0);
  const { scrollYProgress } = useScroll({ container: scroller });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const rangeValue = useMotionValue(0);
  const x = useTransform([smooth, rangeValue], ([p, r]) => -(p as number) * (r as number));

  useEffect(() => {
    const measure = () => {
      if (!track.current || !scroller.current) return;
      const next = Math.max(0, track.current.scrollWidth - scroller.current.clientWidth);
      setRange(next);
      rangeValue.set(next);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [rangeValue]);

  return (
    <div ref={scroller} className={cn("h-[34rem] w-full overflow-y-auto scrollbar-none", className)}>
      <div style={{ height: `calc(100% + ${range}px)` }} className="relative">
        <div className="sticky top-0 flex h-[34rem] flex-col justify-center overflow-hidden">
          <div className="mb-8 px-8">
            <p className="text-sm font-medium text-primary">Selected work</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
              Featured projects
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Scroll down to move through the cards.</p>
          </div>

          <motion.div ref={track} style={{ x }} className="flex w-max gap-5 px-8">
            {PROJECTS.map((project, i) => (
              <article
                key={project.name}
                className="group flex w-72 shrink-0 flex-col gap-4 rounded-2xl border bg-card p-4 transition-colors hover:border-foreground/20"
              >
                <div
                  className={cn(
                    "grid aspect-[16/10] place-items-center rounded-xl bg-gradient-to-br",
                    project.tint
                  )}
                >
                  {project.icon}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{project.name}</h3>
                    <p className="text-xs text-muted-foreground">{project.category}</p>
                  </div>
                  <span className="text-xs tabular-nums text-muted-foreground">0{i + 1}</span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">{project.description}</p>
                <a
                  href="#"
                  className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                >
                  View project
                  <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </article>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
