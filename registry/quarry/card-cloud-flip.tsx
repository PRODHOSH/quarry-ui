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
            EXPANDING LIVING WATERCOLOR LIQUID CLOUD LAYER
            ────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
          {/* Multi-layered liquid water droplet with fluid undulating borders */}
          <motion.div
            style={{
              scale: cloudScale,
              opacity: cloudOpacity,
            }}
            className="relative size-[460px] sm:size-[560px] origin-center"
          >
            {/* SVG Filter for Fluid Liquid Ink-Bleed & Ripple Waves */}
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
                    type="fractalNoise"
                    baseFrequency="0.014 0.016"
                    numOctaves="3"
                    result="noise"
                  >
                    <animate
                      attributeName="baseFrequency"
                      dur="12s"
                      values="0.012 0.015;0.019 0.022;0.015 0.027;0.022 0.016;0.012 0.015"
                      repeatCount="indefinite"
                    />
                  </feTurbulence>
                  <feDisplacementMap
                    in="SourceGraphic"
                    in2="noise"
                    scale="70"
                    xChannelSelector="R"
                    yChannelSelector="G"
                  >
                    <animate
                      attributeName="scale"
                      dur="9s"
                      values="55;85;65;95;55"
                      repeatCount="indefinite"
                    />
                  </feDisplacementMap>
                  <feGaussianBlur stdDeviation="3" />
                </filter>
              </defs>
            </svg>

            {/* Layer 1: Central Liquid Body with undulating morphing edges */}
            <motion.div
              animate={{
                rotate: [0, 360],
                borderRadius: [
                  "50% 50% 50% 50% / 50% 50% 50% 50%",
                  "43% 57% 53% 47% / 56% 44% 56% 44%",
                  "57% 43% 45% 55% / 45% 55% 43% 57%",
                  "50% 50% 50% 50% / 50% 50% 50% 50%",
                ],
              }}
              transition={{
                rotate: { duration: 28, repeat: Infinity, ease: "linear" },
                borderRadius: { duration: 8, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute inset-0"
              style={{
                backgroundColor: cloudColor,
                filter: `url(#${filterId})`,
              }}
            />

            {/* Layer 2: Counter-rotating secondary fluid water lobe */}
            <motion.div
              animate={{
                rotate: [360, 0],
                scale: [0.96, 1.05, 0.96],
                borderRadius: [
                  "47% 53% 58% 42% / 48% 52% 43% 57%",
                  "54% 46% 42% 58% / 56% 44% 58% 42%",
                  "47% 53% 58% 42% / 48% 52% 43% 57%",
                ],
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 6, repeat: Infinity, ease: "easeInOut" },
                borderRadius: { duration: 7, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -inset-4 opacity-90"
              style={{
                backgroundColor: cloudColor,
                filter: `url(#${filterId})`,
              }}
            />

            {/* Layer 3: Darker Inky Capillary Bleed Rim (pools at water edge like watercolor paint) */}
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.04, 1],
                borderRadius: [
                  "49% 51% 54% 46% / 52% 48% 54% 46%",
                  "55% 45% 47% 53% / 46% 54% 48% 52%",
                  "49% 51% 54% 46% / 52% 48% 54% 46%",
                ],
              }}
              transition={{
                rotate: { duration: 24, repeat: Infinity, ease: "linear" },
                scale: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                borderRadius: { duration: 6, repeat: Infinity, ease: "easeInOut" },
              }}
              className="absolute -inset-2 border-[12px] border-black/20 opacity-60"
              style={{
                filter: `url(#${filterId})`,
              }}
            />

            {/* Layer 4: Soft ambient atmospheric glow around expanding water */}
            <div
              className="absolute -inset-14 rounded-full opacity-50 blur-3xl"
              style={{ backgroundColor: cloudColor }}
            />
            <div
              className="absolute -inset-24 rounded-full opacity-30 blur-2xl"
              style={{ backgroundColor: cloudColor }}
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
