"use client";

import { useRef, type RefObject, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * CardCloudFlip — Scroll-Driven 3D Card Flip to Full-Screen Image Reveal
 *
 * In the first frame, an image is displayed at card size. As the user scrolls,
 * the card flips in 3D perspective while an expanding round portal reveals a
 * breathtaking full-screen image that smoothly takes over the entire viewport.
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
  /** Round portal tint color (default: soft lavender-rose #eed3f5) */
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

  // 3D Card Rotation & Pitch (Flips 180° front-to-back)
  const cardRotateY = useTransform(p, [0.1, 0.48], [0, 180]);
  const cardRotateX = useTransform(p, [0.1, 0.28, 0.48], [0, 14, 0]);
  const cardRotateZ = useTransform(p, [0.1, 0.28, 0.48], [0, -6, 0]);
  const cardScale = useTransform(p, [0.1, 0.28, 0.48, 0.62], [1, 0.92, 1, 1.08]);

  // Card fades out after completing its flip so only the full-screen image remains
  const cardOpacity = useTransform(p, [0.46, 0.62], [1, 0]);

  // Expanding Round Circle Portal revealing the full-screen image
  const fullScreenClipPath = useTransform(
    p,
    [0.2, 0.78],
    ["circle(16% at 50% 50%)", "circle(140% at 50% 50%)"]
  );
  const fullScreenOpacity = useTransform(p, [0.12, 0.28], [0, 1]);
  const fullScreenScale = useTransform(p, [0.2, 0.8], [1.08, 1]);

  // Overall Dark Backdrop that recedes as image expands
  const bgDarkOpacity = useTransform(p, [0.5, 0.75], [1, 0]);

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
        {/* Full Canvas Base Layer underneath */}
        <div
          className="absolute inset-0"
          style={{ backgroundColor: cloudColor }}
        />

        {/* Deep Black Backdrop */}
        <motion.div
          style={{ opacity: bgDarkOpacity }}
          className="pointer-events-none absolute inset-0 bg-[#070609]"
        />

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
            <div className="pointer-events-auto absolute inset-0 flex items-center justify-center p-6">
              {fullScreenContent}
            </div>
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

                {/* BACK FACE: Aligns with full screen image during flip */}
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
