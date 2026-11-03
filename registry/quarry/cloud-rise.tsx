"use client";

import { useRef, type RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const clamp = (v: number) => Math.min(1, Math.max(0, v));

/** Soft clouds made of blurred blobs. Each layer is a row of ellipses at set positions. */
const BLOBS = [
  [4, 62, 34, 46], [18, 70, 40, 50], [34, 58, 36, 48], [50, 68, 44, 54], [66, 60, 38, 50], [82, 70, 42, 52], [96, 62, 34, 46],
];
function Clouds({ tone, y, blur, scale = 1 }: { tone: string; y: MotionValue<string>; blur: number; scale?: number }) {
  return (
    <motion.div aria-hidden style={{ y }} className="pointer-events-none absolute inset-x-[-8%] bottom-0 h-[70%]">
      <div className="relative size-full" style={{ filter: `blur(${blur}px)` }}>
        {BLOBS.map(([x, t, w, hgt], i) => (
          <i
            key={i}
            className="absolute rounded-full"
            style={{ left: `${x - w / 2}%`, top: `${t - hgt / 2}%`, width: `${w * scale}%`, height: `${hgt * scale}%`, background: `radial-gradient(closest-side, ${tone}, transparent)` }}
          />
        ))}
      </div>
    </motion.div>
  );
}

/**
 * A pinned hero that scrolls through the clouds. A full picture sits behind a single word. As you
 * scroll, banks of soft cloud rise at different speeds, swallow the picture, and clear to reveal a
 * bright section with a headline that mixes a plain face with an italic one, and two tilted photos
 * that float beside it. Give it a `scrollContainer` and matching `stageHeight` inside a scroll box.
 */
export function CloudRise({
  image = "https://picsum.photos/id/1015/1800/1100",
  words = ["Cleanse", "Protect", "Restore"],
  title = "First Aid",
  accent = "for your skin",
  lead = "Give your skin a little extra care with a gentle mist. Made to calm, protect and keep it feeling clear.",
  cta = { label: "Shop now", href: "#" },
  photos = ["https://picsum.photos/id/64/500/600", "https://picsum.photos/id/338/500/600"],
  scrollContainer,
  stageHeight = "100svh",
  className,
}: {
  image?: string;
  words?: string[];
  title?: string;
  /** The italic line under the title. */
  accent?: string;
  lead?: string;
  cta?: { label: string; href: string };
  photos?: string[];
  scrollContainer?: RefObject<HTMLElement | null>;
  stageHeight?: string;
  className?: string;
}) {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({ target: root, container: scrollContainer, offset: ["start start", "end end"] });

  const zoom = useTransform(p, [0, 0.6], [1, 1.12]);
  const far = useTransform(p, [0, 0.62], ["110%", "-6%"]);
  const mid = useTransform(p, [0.08, 0.66], ["120%", "-14%"]);
  const near = useTransform(p, [0.16, 0.72], ["130%", "-24%"]);
  const wordOpacity = useTransform(p, (v) => clamp((v - 0.04) / 0.1) * (1 - clamp((v - 0.34) / 0.14)));
  const wordIndex = useTransform(p, (v) => Math.min(words.length - 1, Math.floor((v / 0.4) * words.length)));
  const reveal = useTransform(p, [0.58, 0.8], [0, 1]);
  const revealY = useTransform(reveal, (v) => (1 - v) * 40);
  const polA = useTransform(p, [0.62, 0.95], [60, -20]);
  const polB = useTransform(p, [0.66, 1], [90, -10]);

  return (
    <section ref={root} className={cn("relative bg-background", className)} style={{ height: `calc(${stageHeight} * 3)` }}>
      <div className="sticky top-0 overflow-hidden" style={{ height: stageHeight }}>
        <motion.div style={{ scale: zoom }} className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="" className="size-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--primary)_28%,transparent),transparent_45%,color-mix(in_oklab,var(--foreground)_35%,transparent))]" />
        </motion.div>

        <motion.p style={{ opacity: wordOpacity }} className="absolute inset-x-0 bottom-[14%] text-center text-[clamp(1.4rem,1rem+2vw,2.6rem)] font-medium tracking-[0.02em] text-white drop-shadow">
          <Word index={wordIndex} words={words} />
        </motion.p>

        <Clouds tone="color-mix(in oklab, var(--primary) 55%, var(--foreground))" y={far} blur={34} />
        <Clouds tone="color-mix(in oklab, var(--primary) 70%, var(--background))" y={mid} blur={28} scale={1.1} />
        <Clouds tone="color-mix(in oklab, var(--background) 92%, var(--primary))" y={near} blur={22} scale={1.25} />

        <motion.div style={{ opacity: reveal }} className="absolute inset-0 grid place-items-center bg-background">
          <motion.div style={{ y: revealY }} className="relative mx-auto grid w-full max-w-6xl items-center gap-8 px-[clamp(1rem,3.2vw,3rem)] md:grid-cols-[1.1fr_1fr]">
            <div className="text-center md:text-left">
              <h2 className="text-[clamp(2.4rem,1rem+5.4vw,6rem)] font-medium leading-[0.98] tracking-[-0.03em] text-foreground">{title}</h2>
              <p className="font-[family-name:var(--font-instrument)] text-[clamp(2.4rem,1rem+5.4vw,6rem)] italic leading-[0.98] tracking-[-0.02em] text-primary">{accent}</p>
              <p className="mx-auto mt-5 max-w-[40ch] text-muted-foreground md:mx-0">{lead}</p>
              <a href={cta.href} className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-card px-6 text-sm font-semibold text-foreground shadow-[0_10px_30px_-12px_rgb(0_0_0/0.3)] transition-transform active:scale-95">
                {cta.label} <ArrowUpRight className="size-4 text-primary" />
              </a>
            </div>
            <div className="relative mx-auto hidden h-[min(60%,26rem)] w-full max-w-sm md:block">
              {photos.map((src, i) => (
                <motion.div
                  key={src}
                  style={{ y: i ? polB : polA, rotate: i ? 8 : -7 }}
                  className={cn("absolute aspect-[5/6] w-[48%] overflow-hidden rounded-2xl shadow-[0_24px_50px_-20px_rgb(0_0_0/0.45)] ring-4 ring-card", i ? "bottom-0 right-0" : "left-0 top-0")}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" className="size-full object-cover" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function Word({ index, words }: { index: MotionValue<number>; words: string[] }) {
  const text = useTransform(index, (i) => words[Math.round(i)] ?? "");
  return <motion.span>{text}</motion.span>;
}
