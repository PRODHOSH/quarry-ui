"use client";

import { useRef, type RefObject, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * CardCloudFlip — Scroll-Driven 3D Card Flip & Expanding Round Portal
 *
 * A centered minimalist card begins to flip 360° in 3D perspective as the user
 * scrolls, showing its plain white front and plain black back while a clean,
 * round circle portal blooms outward from behind it to consume the viewport.
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
  /** Round portal tint color (default: soft lavender-rose #eed3f5) */
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
  const cardScale = useTransform(p, [0.1, 0.48, 0.85, 1], [1, 0.9, 1, 1]);

  // Round Circle Portal Expansion (Radial Scale)
  const circleScale = useTransform(p, [0.12, 0.45, 0.78, 1], [0, 0.65, 1.8, 3.6]);
  const circleOpacity = useTransform(p, [0.1, 0.22, 0.85, 1], [0, 1, 1, 1]);

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
        {/* Full Pastel Lilac Canvas (Base Layer underneath Round Portal) */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: cloudColor }}
        />

        {/* Deep Black Backdrop that recedes as Round Portal expands */}
        <motion.div
          style={{ opacity: bgDarkOpacity }}
          className="pointer-events-none absolute inset-0 bg-[#070609]"
        />

        {/* ──────────────────────────────────────────
            EXPANDING ROUND PORTAL LAYER
            ────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 grid place-items-center overflow-hidden">
          {/* Clean, perfectly round circular portal */}
          <motion.div
            style={{
              backgroundColor: cloudColor,
              scale: circleScale,
              opacity: circleOpacity,
            }}
            className="size-[520px] rounded-full origin-center sm:size-[640px]"
          />
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
