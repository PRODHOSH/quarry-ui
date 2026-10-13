"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { CopyButton } from "@/components/site/copy-button";
import { registryUrl } from "@/lib/site";

const EASE = [0.32, 0.72, 0, 1] as const;
const rise = (i: number) => ({
  initial: { opacity: 0, y: 24, filter: "blur(6px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 0.9, delay: 0.1 + i * 0.09, ease: EASE },
});

export function Hero({ total }: { total: number }) {
  const ref = useRef<HTMLElement>(null);
  const command = `npx shadcn@latest add ${registryUrl("feature-bento")}`;

  // The glass artwork leans toward the pointer and drifts slower than the page.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rx = useSpring(useTransform(py, [-1, 1], [8, -8]), { stiffness: 70, damping: 16 });
  const ry = useSpring(useTransform(px, [-1, 1], [-10, 10]), { stiffness: 70, damping: 16 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const artY = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <section
      ref={ref}
      className="relative isolate overflow-hidden lg:min-h-[calc(100svh-4rem)]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(60%_60%_at_85%_40%,color-mix(in_oklab,var(--brand)_16%,transparent),transparent_70%)]" />

      <motion.div
        aria-hidden
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.4, delay: 0.2, ease: EASE }}
        style={{ y: artY }}
        className="pointer-events-none absolute -bottom-[14%] -right-[6%] -z-10 h-[92%] w-[60%] [perspective:1200px] max-lg:-right-[28%] max-lg:bottom-0 max-lg:h-[60%] max-lg:w-[95%] max-lg:opacity-50"
      >
        <motion.div style={{ rotateX: rx, rotateY: ry }} className="h-full w-full [transform-style:preserve-3d]">
          <motion.div animate={{ y: [0, -14, 0], rotate: [0, 2, 0] }} transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} className="relative h-full w-full">
            <Image src="/brand/glass.webp" alt="" fill priority sizes="(min-width:1024px) 62vw, 95vw" className="glass-art-corner object-contain object-right-bottom" />
          </motion.div>
        </motion.div>
      </motion.div>

      <div className="mx-auto flex max-w-6xl items-center px-6 py-14 lg:min-h-[calc(100svh-4rem)] lg:py-10">
        <div className="max-w-xl">
          <motion.p {...rise(0)} className="font-label inline-flex items-center gap-2 text-xs uppercase tracking-wide text-muted-foreground">
            <Sparkles className="size-3.5 text-brand" />
            {total} free sections · shadcn registry
          </motion.p>
          <motion.h1 {...rise(1)} className="mt-5 text-balance text-[clamp(2.6rem,min(5.6vw,9vh),4.9rem)] font-medium leading-[1.02] tracking-[-0.04em]">
            Whole pages from <span className="text-brand">one prompt.</span>
          </motion.h1>
          <motion.p {...rise(2)} className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted-foreground">
            Paste one prompt into Claude Code, Cursor or Antigravity. Clean, themed sections land in your repo, styled by your own tokens.
          </motion.p>
          <motion.div {...rise(3)} className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/components"
              className="font-label group inline-flex h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-[13px] uppercase text-background transition-transform duration-500 [transition-timing-function:cubic-bezier(0.32,0.72,0,1)] active:scale-[0.98]"
            >
              Start now
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-px group-hover:translate-x-0.5" />
            </Link>
            <Link href="/#pricing" className="font-label inline-flex h-11 items-center rounded-lg border px-5 text-[13px] uppercase transition-colors hover:bg-accent">
              View pricing
            </Link>
          </motion.div>
          <motion.div {...rise(4)} className="mt-6 flex h-11 min-w-0 max-w-md items-center rounded-lg border bg-card/50 pl-4 pr-1.5">
            <code className="min-w-0 flex-1 truncate font-mono text-[12.5px] text-foreground">
              <span className="mr-2 text-[#7fa3ff]">$</span>npx shadcn@latest add feature-bento
            </code>
            <CopyButton value={command} className="ml-2 h-8 shrink-0 rounded-md bg-muted px-3 py-0 text-[13px] text-foreground hover:bg-accent" />
          </motion.div>
        </div>

      </div>
    </section>
  );
}
