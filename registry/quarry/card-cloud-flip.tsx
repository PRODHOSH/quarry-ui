"use client";

import { useRef, type RefObject, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * CardCloudFlip — Scroll-Driven 3D Card Flip & Expanding Watercolor Cloud
 *
 * A centered minimalist card begins to flip 360° in 3D perspective as the user
 * scrolls, showing its plain white front and plain black back while a lush
 * pastel watercolor cloud blooms outward from behind it to consume the viewport
 * and reveal a sleek phone frame.
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
  /** Optional custom front content (defaults to a sleek, plain white card) */
  frontContent?: ReactNode;
  /** Optional custom back content (defaults to a sleek, plain black card) */
  backContent?: ReactNode;
  /** Legacy card prop for backwards compatibility */
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

/** Plain White Card Front */
export function CardFront({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative size-full rounded-[1.75rem] border border-neutral-200/80 bg-white shadow-2xl transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Plain Black Card Back */
export function CardBack({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative size-full rounded-[1.75rem] border border-neutral-900 bg-neutral-950 shadow-2xl transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardCloudFlip({
  frontContent,
  backContent,
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
                {/* FRONT FACE (Plain White Card) */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <CardFront>{frontContent}</CardFront>
                </div>

                {/* BACK FACE (Plain Black Card) */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <CardBack>{backContent}</CardBack>
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
