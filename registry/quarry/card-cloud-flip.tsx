"use client";

import { useId, useRef, type RefObject, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * CardCloudFlip — Scroll-Driven 3D Card Flip & Expanding Watercolor Cloud
 *
 * A centered minimalist card begins to flip 360° in 3D perspective as the user
 * scrolls, showing its plain white front and plain black back while a lush
 * pastel watercolor cloud blooms outward from behind it to consume the viewport.
 * The water cloud features undulating, living liquid watercolor edges.
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
  const filterId = useId();
  const { scrollYProgress: p } = useScroll({
    target: root,
    container: scrollContainer,
    offset: ["start start", "end end"],
  });

  // 3D Card Rotation & Pitch
  const cardRotateY = useTransform(p, [0.1, 0.48, 0.82], [0, 180, 360]);
  const cardRotateX = useTransform(p, [0.1, 0.45, 0.82], [0, 16, 0]);
  const cardRotateZ = useTransform(p, [0.1, 0.45, 0.82], [0, -8, 0]);
  const cardScale = useTransform(p, [0.1, 0.48, 0.85, 1], [1, 0.9, 1, 1]);

  // Cloud Bloom Expansion (Radial Organic Scale)
  const cloudScale = useTransform(p, [0.12, 0.45, 0.78, 1], [0, 0.65, 1.8, 3.2]);
  const cloudOpacity = useTransform(p, [0.1, 0.22, 0.85, 1], [0, 1, 1, 1]);

  // Overall Background Color Shift
  const bgDarkOpacity = useTransform(p, [0.55, 0.78], [1, 0]);

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
            EXPANDING LIVING FIREFLAME WATERCOLOR BURST
            ────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
          {/* Asymmetrical organic fireflame silhouette with licking tongues */}
          <motion.div
            style={{
              scale: cloudScale,
              opacity: cloudOpacity,
            }}
            className="relative h-[480px] w-[620px] origin-center sm:h-[600px] sm:w-[780px]"
          >
            {/* SVG Filter for Fiery Jagged Flame Bleed & Licking Wisps */}
            <svg className="absolute size-0">
              <defs>
                <filter
                  id={filterId}
                  x="-35%"
                  y="-35%"
                  width="170%"
                  height="170%"
                  filterUnits="objectBoundingBox"
                >
                  <feTurbulence
                    type="turbulence"
                    baseFrequency="0.009 0.018"
                    numOctaves="4"
                    result="flameNoise"
                  >
                    <animate
                      attributeName="baseFrequency"
                      dur="6s"
                      values="0.008 0.016;0.012 0.024;0.009 0.020;0.013 0.015;0.008 0.016"
                      repeatCount="indefinite"
                    />
                  </feTurbulence>
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="flameNoise"
                    scale="95"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  >
                    <animate
                      attributeName="scale"
                      dur="5s"
                      values="80;115;90;125;80"
                      repeatCount="indefinite"
                    />
                  </feDisplacementMap>
                  <feGaussianBlur stdDeviation="1.5" />
                </filter>
              </defs>
            </svg>

            {/* Main Asymmetrical Flame Body */}
            <motion.div
              animate={{
                scale: [1, 1.04, 0.98, 1.03, 1],
                skewX: [-2, 3, -1, 2, -2],
                skewY: [1, -2, 2, -1, 1],
                borderRadius: [
                  "42% 58% 70% 30% / 45% 45% 55% 55%",
                  "55% 45% 38% 62% / 58% 52% 48% 42%",
                  "38% 62% 65% 35% / 40% 60% 40% 60%",
                  "42% 58% 70% 30% / 45% 45% 55% 55%",
                ],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute inset-0"
              style={{
                backgroundColor: cloudColor,
                filter: `url(#${filterId})`,
              }}
            />

            {/* Bottom-Left Licking Flame Tongue */}
            <motion.div
              animate={{
                scale: [0.95, 1.14, 0.98, 1.08, 0.95],
                x: [0, -18, 4, -12, 0],
                y: [0, 16, -6, 10, 0],
                rotate: [-8, 6, -4, 3, -8],
              }}
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -bottom-12 -left-14 h-[68%] w-[62%] rounded-[30%_70%_60%_40%/50%_30%_70%_50%]"
              style={{
                backgroundColor: cloudColor,
                filter: `url(#${filterId})`,
              }}
            />

            {/* Top-Right Billowing Flame Plume */}
            <motion.div
              animate={{
                scale: [1.02, 0.95, 1.07, 0.97, 1.02],
                x: [0, 14, -6, 10, 0],
                y: [0, -12, 5, -8, 0],
                rotate: [6, -4, 7, -2, 6],
              }}
              transition={{
                duration: 5.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-12 -right-10 h-[68%] w-[65%] rounded-[60%_40%_45%_55%/40%_60%_40%_60%]"
              style={{
                backgroundColor: cloudColor,
                filter: `url(#${filterId})`,
              }}
            />

            {/* Top-Left Secondary Flame Tongue */}
            <motion.div
              animate={{
                scale: [0.97, 1.06, 0.95, 1.03, 0.97],
                y: [0, -10, 3, -7, 0],
                rotate: [-4, 5, -2, 4, -4],
              }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-8 left-8 h-[55%] w-[55%] rounded-[50%_50%_35%_65%/60%_40%_60%_40%]"
              style={{
                backgroundColor: cloudColor,
                filter: `url(#${filterId})`,
              }}
            />

            {/* Dark Inky/Charred Perimeter Bleed Rim */}
            <motion.div
              animate={{
                scale: [1, 1.03, 0.99, 1.02, 1],
                skewX: [2, -2, 1, -1, 2],
                borderRadius: [
                  "44% 56% 68% 32% / 46% 44% 56% 54%",
                  "56% 44% 36% 64% / 56% 54% 46% 44%",
                  "44% 56% 68% 32% / 46% 44% 56% 54%",
                ],
              }}
              transition={{
                duration: 5.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -inset-3 border-[10px] border-black/35 opacity-70"
              style={{
                filter: `url(#${filterId})`,
              }}
            />
          </motion.div>
        </div>

        {/* ──────────────────────────────────────────
            CENTER 3D FLIPPING CARD
            ────────────────────────────────────────── */}
        <div className="relative z-10 flex size-full items-center justify-center p-4">
          <div className="relative flex items-center justify-center">
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
