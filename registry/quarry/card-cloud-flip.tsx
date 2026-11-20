"use client";

import { useRef, type RefObject, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * CardCloudFlip — Scroll-Driven 3D Card Flip to Full-Screen Image Reveal
 *
 * In the first frame, an image is displayed at card size. As the user scrolls,
 * the card flips in 3D perspective to 90° and vanishes into an expanding round
 * portal that smoothly reveals a full-screen image taking over the entire viewport.
 * ───────────────────────────────────────────────────────────────────────────── */

export type QuestCardData = {
  guild?: string;
  title?: string;
  description?: string;
  footerNote?: string;
  avatars?: string[];
  avatarCount?: string;
};

export const DEFAULT_FRONT_IMAGE =
  "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80";

export const DEFAULT_BACK_IMAGE =
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&auto=format&fit=crop&q=80";

export type CardCloudFlipProps = {
  /** Image shown on the card in the first frame (card size) */
  frontImage?: string;
  /** Image shown in full screen after flipping */
  backImage?: string;
  /** Optional custom card front content (overrides frontImage) */
  frontContent?: ReactNode;
  /** Optional custom card back content (overrides backImage on card) */
  backContent?: ReactNode;
  /** Optional content/text overlay on top of the full-screen image */
  fullScreenContent?: ReactNode;
  /** Legacy card prop for backwards compatibility */
  card?: QuestCardData;
  /** Optional background tint color */
  cloudColor?: string;
  /** Optional scroll container ref for embedded preview boxes */
  scrollContainer?: RefObject<HTMLElement | null>;
  /** Sticky frame height (default: 100svh) */
  stageHeight?: string;
  /** Custom container class name */
  className?: string;
};

/** Card Front container */
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
        "relative size-full overflow-hidden rounded-[1.75rem] border border-white/20 bg-neutral-900 shadow-2xl transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}

/** Card Back container */
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
        "relative size-full overflow-hidden rounded-[1.75rem] border border-white/20 bg-neutral-900 shadow-2xl transition-all",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardCloudFlip({
  frontImage = DEFAULT_FRONT_IMAGE,
  backImage = DEFAULT_BACK_IMAGE,
  frontContent,
  backContent,
  fullScreenContent,
  cloudColor,
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

  // 3D Card Rotation: Rotates from 0° to 90° edge-on and disappears
  const cardRotateY = useTransform(p, [0.08, 0.32], [0, 90]);
  const cardRotateX = useTransform(p, [0.08, 0.18, 0.31], [0, 8, 0]);
  const cardRotateZ = useTransform(p, [0.08, 0.18, 0.31], [0, -4, 0]);
  const cardScale = useTransform(p, [0.08, 0.18, 0.31], [1, 0.96, 1]);

  // Card disappears right at 90 degrees
  const cardOpacity = useTransform(p, [0.08, 0.25, 0.31], [1, 1, 0]);
  const cardPointerEvents = useTransform(p, (v) => (v >= 0.31 ? "none" : "auto"));

  // Expanding Round Circle Portal revealing the full-screen image
  const fullScreenClipPath = useTransform(
    p,
    [0.12, 0.72],
    ["circle(16% at 50% 50%)", "circle(140% at 50% 50%)"]
  );
  const fullScreenOpacity = useTransform(p, [0.06, 0.18], [0, 1]);
  const fullScreenScale = useTransform(p, [0.12, 0.72], [1.08, 1]);

  // Overlay text fade-in as full-screen image takes over
  const fullScreenContentOpacity = useTransform(p, [0.55, 0.75], [0, 1]);

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
        className="sticky top-0 w-full overflow-hidden bg-[#08070b]"
        style={{ height: stageHeight }}
      >
        {/* Optional Custom Background Tint */}
        {cloudColor && (
          <div
            className="absolute inset-0"
            style={{ backgroundColor: cloudColor }}
          />
        )}

        {/* ──────────────────────────────────────────
            FULL-SCREEN IMAGE (EXPANDING ROUND PORTAL)
            ────────────────────────────────────────── */}
        <motion.div
          style={{
            clipPath: fullScreenClipPath,
            opacity: fullScreenOpacity,
          }}
          className="pointer-events-none absolute inset-0 size-full overflow-hidden"
        >
          <motion.div style={{ scale: fullScreenScale }} className="size-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backImage}
              alt="Full screen background"
              className="size-full object-cover"
              loading="eager"
            />
          </motion.div>

          {/* Subtle cinematic gradient vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-40" />

          {/* Optional Overlay Content */}
          {fullScreenContent && (
            <motion.div
              style={{ opacity: fullScreenContentOpacity }}
              className="pointer-events-auto absolute inset-0 flex items-center justify-center p-6"
            >
              {fullScreenContent}
            </motion.div>
          )}
        </motion.div>

        {/* ──────────────────────────────────────────
            CENTER 3D FLIPPING CARD (CARD SIZE IN FIRST FRAME)
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
                  opacity: cardOpacity,
                  pointerEvents: cardPointerEvents,
                  transformStyle: "preserve-3d",
                }}
                className="relative h-[390px] w-[270px] sm:h-[430px] sm:w-[300px]"
              >
                {/* FRONT FACE: Image in the size of the card */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  <CardFront>
                    {frontContent ?? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={frontImage}
                          alt="Card front"
                          className="size-full select-none object-cover"
                          loading="eager"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
                      </>
                    )}
                  </CardFront>
                </div>

                {/* BACK FACE CONTAINER (Preserved for compatibility) */}
                <div
                  className="absolute inset-0"
                  style={{
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  <CardBack>
                    {backContent ?? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={backImage}
                          alt="Card back"
                          className="size-full select-none object-cover"
                          loading="eager"
                        />
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-white/10" />
                      </>
                    )}
                  </CardBack>
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
