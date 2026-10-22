"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

function Placeholder() {
  return (
    <div className="grid size-full place-items-center p-6">
      <div className="flex w-full max-w-[14rem] flex-col gap-2.5">
        <span className="h-3 w-3/4 rounded-full bg-foreground/80" />
        <span className="h-3 w-full rounded-full bg-muted-foreground/25" />
        <span className="h-3 w-2/3 rounded-full bg-muted-foreground/25" />
        <span className="mt-2 h-9 w-28 rounded-full bg-primary" />
      </div>
    </div>
  );
}

/**
 * A closing call to action. A light panel holds the message and two buttons, with an illustration
 * on the right that sits slightly taller than the panel so it feels like it is stepping out. Pass
 * any node as `illustration`.
 */
export function CtaBanner({
  eyebrow = "Ready when you are",
  title = "Start building something you are proud of",
  text = "Join thousands of teams who ship calmer, clearer work. It takes about five minutes to set up.",
  primary = "Create your workspace",
  secondary = "Talk to us",
  illustration,
  className,
}: {
  eyebrow?: string;
  title?: string;
  text?: string;
  primary?: string;
  secondary?: string;
  /** Any node. An <img> works well. It is contained in the right hand side. */
  illustration?: ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn("mx-auto my-16 grid w-full max-w-6xl overflow-hidden rounded-[2rem] border bg-muted/50 md:grid-cols-[1.15fr_1fr]", className)}
    >
      <div className="px-8 py-12 sm:px-12 sm:py-16">
        <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-3 max-w-lg text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">{title}</h2>
        <p className="mt-4 max-w-md leading-relaxed text-muted-foreground">{text}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a href="#" className="group inline-flex h-12 items-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground transition-transform active:scale-95">
            {primary} <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </a>
          <a href="#" className="inline-flex h-12 items-center rounded-full border bg-background px-6 text-sm font-medium transition-colors hover:bg-card active:scale-95">{secondary}</a>
        </div>
      </div>
      <div className="relative min-h-[16rem] border-t bg-card md:border-l md:border-t-0">
        <div aria-hidden className="absolute inset-0 [background-image:radial-gradient(var(--border)_1px,transparent_1px)] [background-size:20px_20px] [mask-image:radial-gradient(ellipse_at_center,#000_40%,transparent_90%)]" />
        <motion.div animate={{ y: [0, -6, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 grid place-items-center p-6 [&_img]:max-h-full [&_img]:w-full [&_img]:object-contain [&_svg]:max-h-full">
          {illustration ?? <Placeholder />}
        </motion.div>
      </div>
    </motion.section>
  );
}
