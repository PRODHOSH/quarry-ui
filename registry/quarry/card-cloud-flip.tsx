"use client";

import { useId, useRef, type RefObject } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * CardCloudFlip — Scroll-Driven 3D Card Flip & Expanding Watercolor Cloud
 *
 * A centered quest card begins to flip 360° in 3D perspective as the user
 * scrolls, while a lush pastel watercolor cloud blooms outward from behind it
 * to consume the viewport and smoothly reveal a sleek phone frame.
 * ───────────────────────────────────────────────────────────────────────────── */

export type QuestCardData = {
  guild?: string;
  title?: string;
  description?: string;
  footerNote?: string;
  avatars?: string[];
  avatarCount?: string;
};

export type CardCloudFlipProps = {
  /** The quest card details */
  card?: QuestCardData;
  /** Cloud tint color (default: soft lavender-rose #eed3f5) */
  cloudColor?: string;
  /** Optional scroll container ref for embedded preview boxes */
  scrollContainer?: RefObject<HTMLElement | null>;
  /** Sticky frame height (default: 100svh) */
  stageHeight?: string;
  /** Custom container class name */
  className?: string;
};

const DEFAULT_CARD: QuestCardData = {
  guild: "THE TEMPERERS",
  title: "Aegis Vanguard",
  avatars: [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80",
  ],
  avatarCount: "+12",
};

/** Geometric Coat-of-Arms Crest Shield */
function CrestShield({ className }: { className?: string }) {
  const clipId = useId();
  return (
    <svg viewBox="0 0 48 56" className={cn("size-8 drop-shadow-sm", className)} fill="none">
      <defs>
        <clipPath id={clipId}>
          <path d="M4 2 h40 v28 c0 14 -20 24 -20 24 s-20 -10 -20 -24 Z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#${clipId})`}>
        <rect width="48" height="56" fill="#141216" />
        {/* Downward vermillion chevron-checker pattern */}
        <path d="M0 0 L24 22 L48 0 Z" fill="#ff3811" />
        <path d="M0 14 L24 36 L48 14 Z" fill="#ff3811" opacity="0.9" />
        <path d="M0 28 L24 50 L48 28 Z" fill="#ff3811" opacity="0.85" />
        <path d="M24 0 L48 22 L24 44 L0 22 Z" fill="#141216" opacity="0.4" />
        {/* Fine divider stroke */}
        <line x1="24" y1="0" x2="24" y2="56" stroke="#000" strokeWidth="1" opacity="0.6" />
      </g>
    </svg>
  );
}

/** Card Back Heraldic Pattern */
function CardBackPattern() {
  return (
    <div className="relative size-full overflow-hidden rounded-[1.75rem] border border-neutral-900 bg-[#0f0e13] p-5">
      {/* Intricate Heraldic Orange & Black Tapestry */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#221d28_0%,#0f0e13_100%)]" />
      <div className="relative flex size-full flex-col items-center justify-between py-6">
        <CrestShield className="size-10" />
        {/* Center Geometric Emblem */}
        <div className="relative size-32">
          <svg viewBox="0 0 100 120" className="size-full drop-shadow-xl" fill="none">
            <polygon points="50,10 90,45 50,110 10,45" fill="#ff3811" />
            <polygon points="50,22 80,48 50,96 20,48" fill="#151218" />
            <polygon points="50,34 70,52 50,82 30,52" fill="#ff3811" />
            <line x1="50" y1="10" x2="50" y2="110" stroke="#0e0b11" strokeWidth="2" />
            <line x1="10" y1="45" x2="90" y2="45" stroke="#0e0b11" strokeWidth="2" />
          </svg>
        </div>
        <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-[#ff3811]/90">
          The Temperers of Steel
        </p>
      </div>
    </div>
  );
}

/** Front Face of the Quest Card with rich geometric illustration and zero bulky text */
function CardFrontContent({ card }: { card: QuestCardData }) {
  const prismId = useId();

  return (
    <div className="relative flex size-full select-none flex-col justify-between overflow-hidden rounded-[1.75rem] border border-neutral-200/90 bg-[#fefefe] p-5 shadow-2xl transition-all sm:p-6">
      {/* Micro-dot security matrix background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#171717_1px,transparent_1px)] [background-size:14px_14px] opacity-[0.035]" />

      {/* Double-bezel inner hairline frame */}
      <div className="pointer-events-none absolute inset-2.5 rounded-[1.25rem] border border-neutral-200/70" />

      {/* Technical corner crosshair marks */}
      <div className="pointer-events-none absolute top-3.5 left-3.5 font-mono text-[9px] text-neutral-300 leading-none">＋</div>
      <div className="pointer-events-none absolute top-3.5 right-3.5 font-mono text-[9px] text-neutral-300 leading-none">＋</div>
      <div className="pointer-events-none absolute bottom-3.5 left-3.5 font-mono text-[9px] text-neutral-300 leading-none">＋</div>
      <div className="pointer-events-none absolute bottom-3.5 right-3.5 font-mono text-[9px] text-neutral-300 leading-none">＋</div>

      {/* ──────────────── TOP ROW: Shield + Status Pill ──────────────── */}
      <div className="relative z-10 flex items-center justify-between">
        <CrestShield className="size-7" />
        <div className="flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-neutral-100/70 px-2.5 py-0.5 backdrop-blur-xs">
          <span className="size-1.5 rounded-full bg-[#ff3811] animate-pulse" />
          <span className="font-mono text-[9px] font-semibold tracking-wider text-neutral-700">№ 024</span>
        </div>
      </div>

      {/* ──────────────── CENTER HERO GRAPHIC ILLUSTRATION ──────────────── */}
      <div className="relative z-10 my-auto flex flex-col items-center justify-center py-1">
        {/* Soft vermillion / amber ambient glow */}
        <div className="absolute size-36 rounded-full bg-gradient-to-tr from-[#ff3811]/15 via-amber-500/10 to-transparent blur-xl" />

        {/* Intricate Heraldic Geometric Mandala / Compass Sigil */}
        <svg viewBox="0 0 160 160" className="relative size-36 drop-shadow-sm" fill="none">
          {/* Concentric calibration rings */}
          <circle cx="80" cy="80" r="74" stroke="#e5e5e5" strokeWidth="1" strokeDasharray="2 4" />
          <circle cx="80" cy="80" r="66" stroke="#171717" strokeWidth="0.75" opacity="0.18" />
          <circle cx="80" cy="80" r="54" stroke="#ff3811" strokeWidth="0.8" opacity="0.3" strokeDasharray="5 3" />

          {/* Cardinal Axis Ticks */}
          <line x1="80" y1="2" x2="80" y2="10" stroke="#171717" strokeWidth="1.5" />
          <line x1="80" y1="150" x2="80" y2="158" stroke="#171717" strokeWidth="1.5" />
          <line x1="2" y1="80" x2="10" y2="80" stroke="#171717" strokeWidth="1.5" />
          <line x1="150" y1="80" x2="158" y2="80" stroke="#171717" strokeWidth="1.5" />

          {/* Precision dial ring */}
          <circle cx="80" cy="80" r="74" stroke="#171717" strokeWidth="1" strokeDasharray="1 19.3" opacity="0.25" />

          {/* Fine Diagonal Crosshair Axes */}
          <line x1="38" y1="38" x2="122" y2="122" stroke="#e5e5e5" strokeWidth="0.75" />
          <line x1="122" y1="38" x2="38" y2="122" stroke="#e5e5e5" strokeWidth="0.75" />

          {/* Outer Rotating Diamond Frame */}
          <rect
            x="42"
            y="42"
            width="76"
            height="76"
            rx="8"
            transform="rotate(45 80 80)"
            stroke="#171717"
            strokeWidth="1"
            opacity="0.18"
          />

          {/* Center Faceted Diamond Star / Prism */}
          <polygon points="80,30 118,68 80,130 42,68" fill={`url(#${prismId})`} />
          <polygon points="80,42 108,70 80,116 52,70" fill="#141216" />
          <polygon points="80,54 98,72 80,102 62,72" fill="#ff3811" opacity="0.92" />
          <polygon points="80,62 90,72 80,88 70,72" fill="#ff6433" opacity="0.85" />

          {/* Center White Core Accent */}
          <circle cx="80" cy="73" r="3" fill="#ffffff" />

          {/* Fine Divider Line through diamond */}
          <line x1="80" y1="30" x2="80" y2="130" stroke="#0e0b11" strokeWidth="1" opacity="0.5" />
          <line x1="42" y1="68" x2="118" y2="68" stroke="#0e0b11" strokeWidth="1" opacity="0.5" />

          <defs>
            <linearGradient id={prismId} x1="42" y1="30" x2="118" y2="130" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff3811" />
              <stop offset="0.6" stopColor="#e02600" />
              <stop offset="1" stopColor="#141216" />
            </linearGradient>
          </defs>
        </svg>

        {/* Minimalist Typographic Lockup */}
        <div className="mt-3 flex flex-col items-center text-center">
          <span className="font-mono text-[9px] font-semibold uppercase tracking-[0.28em] text-[#ff3811]">
            {card.guild ?? "THE TEMPERERS"}
          </span>
          <h4 className="mt-1 text-base font-bold tracking-tight text-neutral-900 sm:text-lg">
            {card.title ?? "Aegis Vanguard"}
          </h4>
          <div className="mt-1 flex items-center gap-1.5 font-mono text-[9px] text-neutral-400">
            <span>CHRONO KEY</span>
            <span className="text-neutral-300">•</span>
            <span>SERIES 02</span>
          </div>
        </div>
      </div>

      {/* ──────────────── BOTTOM ROW: Avatars + Barcode Serial ──────────────── */}
      <div className="relative z-10 border-t border-neutral-100 pt-3">
        <div className="flex items-center justify-between">
          {/* Avatar Cluster */}
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {(card.avatars ?? []).map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={src}
                  alt=""
                  className="size-6 rounded-full border-2 border-white object-cover shadow-2xs"
                />
              ))}
            </div>
            {card.avatarCount && (
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 font-mono text-[9px] font-medium text-neutral-600">
                {card.avatarCount}
              </span>
            )}
          </div>

          {/* Micro-Barcode & Serial Stamp */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-0.5 opacity-75">
              <div className="h-3 w-0.5 bg-neutral-800" />
              <div className="h-3 w-1 bg-neutral-800" />
              <div className="h-3 w-0.5 bg-neutral-300" />
              <div className="h-3 w-1.5 bg-neutral-800" />
              <div className="h-3 w-0.5 bg-neutral-800" />
              <div className="h-3 w-1 bg-neutral-300" />
              <div className="h-3 w-0.5 bg-neutral-800" />
              <div className="h-3 w-1.5 bg-neutral-800" />
              <div className="h-3 w-0.5 bg-neutral-800" />
            </div>
            <span className="mt-0.5 font-mono text-[8px] uppercase tracking-wider text-neutral-400">
              AUT-9921
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardCloudFlip({
  card = DEFAULT_CARD,
  cloudColor = "#eed3f5",
  scrollContainer,
  stageHeight = "100svh",
  className,
}: CardCloudFlipProps) {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: root,
    container: scrollContainer,
    offset: ["start start", "end end"],
  });

  // 3D Card Rotation & Pitch
  const cardRotateY = useTransform(p, [0.1, 0.48, 0.82], [0, 180, 360]);
  const cardRotateX = useTransform(p, [0.1, 0.45, 0.82], [0, 16, 0]);
  const cardRotateZ = useTransform(p, [0.1, 0.45, 0.82], [0, -8, 0]);
  const cardScale = useTransform(p, [0.1, 0.48, 0.85, 1], [1, 0.86, 0.94, 0.94]);

  // Cloud Bloom Expansion (Radial Organic Scale)
  const cloudScale = useTransform(p, [0.12, 0.45, 0.78, 1], [0, 0.65, 1.8, 3.2]);
  const cloudOpacity = useTransform(p, [0.1, 0.22, 0.85, 1], [0, 1, 1, 1]);

  // Overall Background Color Shift
  const bgDarkOpacity = useTransform(p, [0.55, 0.78], [1, 0]);

  // Phone Mockup Materialization around Card
  const phoneFrameOpacity = useTransform(p, [0.72, 0.86], [0, 1]);
  const phoneFrameScale = useTransform(p, [0.72, 0.86], [0.94, 1]);

  return (
    <section
      ref={root}
      className={cn("relative w-full bg-[#08070b] text-neutral-100", className)}
      style={{ height: `calc(${stageHeight} * 3.4)` }}
    >
      {/* ──────────────────────────────────────────
          STICKY VIEWPORT STAGE
          ────────────────────────────────────────── */}
      <div
        className="sticky top-0 w-full overflow-hidden"
        style={{ height: stageHeight }}
      >
        {/* Full Pastel Lilac Canvas (Base Layer underneath Cloud) */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: cloudColor }}
        />

        {/* Deep Black Backdrop that recedes as Cloud expands */}
        <motion.div
          style={{ opacity: bgDarkOpacity }}
          className="pointer-events-none absolute inset-0 bg-[#070609]"
        />

        {/* ──────────────────────────────────────────
            EXPANDING WATERCOLOR CLOUD LAYER
            ────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
          {/* Multi-layered organic cloud puff with turbulent edges */}
          <motion.div
            style={{
              scale: cloudScale,
              opacity: cloudOpacity,
            }}
            className="relative size-[460px] sm:size-[560px] origin-center"
          >
            {/* SVG Filter for Organic Ink-Bleed / Smoky Cloud Edges */}
            <svg className="absolute size-0">
              <defs>
                <filter id="cloud-bleed" x="-20%" y="-20%" width="140%" height="140%">
                  <feTurbulence
                    type="fractalNoise"
                    baseFrequency="0.018"
                    numOctaves="4"
                    result="noise"
                  />
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="55"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  />
                  <feGaussianBlur stdDeviation="4" />
                </filter>
              </defs>
            </svg>

            {/* Central Cloud Body with Turbulent Filter */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: cloudColor,
                filter: "url(#cloud-bleed)",
              }}
            />

            {/* Soft Ambient Glow Haloes */}
            <div
              className="absolute -inset-10 rounded-full opacity-70 blur-3xl"
              style={{ backgroundColor: cloudColor }}
            />
            <div
              className="absolute -inset-20 rounded-full opacity-40 blur-2xl"
              style={{ backgroundColor: cloudColor }}
            />
          </motion.div>
        </div>

        {/* ──────────────────────────────────────────
            CENTER 3D FLIPPING CARD & PHONE FRAME
            ────────────────────────────────────────── */}
        <div className="relative z-10 flex size-full items-center justify-center p-4">
          <div className="relative flex items-center justify-center">
            {/* Phone Mockup Frame that fades in around the card in Phase 3 */}
            <motion.div
              style={{
                opacity: phoneFrameOpacity,
                scale: phoneFrameScale,
              }}
              className="pointer-events-none absolute -inset-y-9 -inset-x-6 sm:-inset-y-12 sm:-inset-x-8 rounded-[3.2rem] border-[7px] border-white/80 bg-white/20 shadow-[0_24px_60px_-15px_rgba(160,100,190,0.35)] backdrop-blur-md"
            >
              {/* Dynamic Island Speaker Pill */}
              <div className="mx-auto mt-3 h-5 w-24 rounded-full bg-neutral-950/90 shadow-inner" />
            </motion.div>

            {/* 3D Rotating Card Container */}
            <div
              className="relative size-full"
              style={{ perspective: 1200 }}
            >
              <motion.div
                style={{
                  rotateY: cardRotateY,
                  rotateX: cardRotateX,
                  rotateZ: cardRotateZ,
                  scale: cardScale,
                  transformStyle: "preserve-3d",
                }}
                className="relative h-[390px] w-[270px] sm:h-[430px] sm:w-[300px]"
              >
                {/* FRONT FACE */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <CardFrontContent card={card} />
                </div>

                {/* BACK FACE */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <CardBackPattern />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CardCloudFlip;
