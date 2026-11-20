"use client";

import { useRef, type RefObject, type ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * CardBlurReveal — Scroll-Driven 3D Card Flip to Full-Screen Image Blur-Reveal
 *
 * In the first frame, an image is displayed at card size over an atmospheric,
 * blurred backdrop. As the user scrolls, the card flips in 3D perspective to
 * 90° and vanishes, while the background smoothly unblurs into a razor-sharp,
 * breathtaking full-screen image reveal across the entire viewport.
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

export type CardBlurRevealProps = {
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

export function CardBlurReveal({
  frontImage = DEFAULT_FRONT_IMAGE,
  backImage = DEFAULT_BACK_IMAGE,
  frontContent,
  backContent,
  fullScreenContent,
  cloudColor,
  scrollContainer,
  stageHeight = "100svh",
  className,
}: CardBlurRevealProps) {
  const root = useRef<HTMLElement>(null);
  const { scrollYProgress: p } = useScroll({
    target: root,
    container: scrollContainer,
    offset: ["start start", "end end"],
  });

  // 3D Card Rotation: Rotates from 0° to 90° edge-on and vanishes
  const cardRotateY = useTransform(p, [0.06, 0.28], [0, 90]);
  const cardRotateX = useTransform(p, [0.06, 0.17, 0.28], [0, 8, 0]);
  const cardRotateZ = useTransform(p, [0.06, 0.17, 0.28], [0, -4, 0]);
  const cardScale = useTransform(p, [0.06, 0.17, 0.28], [1, 0.96, 1]);

  // Card disappears right at 90 degrees
  const cardOpacity = useTransform(p, [0.06, 0.23, 0.28], [1, 1, 0]);
  const cardPointerEvents = useTransform(p, (v) => (v >= 0.28 ? "none" : "auto"));

  // Blur-to-reveal full-screen background animation
  const bgBlur = useTransform(p, [0.06, 0.42], [28, 0]);
  const bgFilter = useTransform(bgBlur, (b) =>
    b <= 0.1 ? "none" : `blur(${b.toFixed(1)}px)`
  );
  const bgScale = useTransform(p, [0.06, 0.42], [1.1, 1]);
  const bgDimOpacity = useTransform(p, [0.06, 0.42], [0.4, 0.12]);

  // Overlay text fade-in as full-screen image clarifies
  const fullScreenContentOpacity = useTransform(p, [0.38, 0.58], [0, 1]);

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
            FULL-SCREEN IMAGE (BLUR-TO-REVEAL)
            ────────────────────────────────────────── */}
        <div className="pointer-events-none absolute inset-0 size-full overflow-hidden">
          <motion.div
            style={{
              filter: bgFilter,
              scale: bgScale,
            }}
            className="size-full"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={backImage}
              alt="Full screen background"
              className="size-full object-cover"
              loading="eager"
            />
          </motion.div>

          {/* Cinematic overlay that clears as background sharpens */}
          <motion.div
            style={{ opacity: bgDimOpacity }}
            className="absolute inset-0 bg-black"
          />

          {/* Subtle vignette gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-30" />

          {/* Optional Overlay Content */}
          {fullScreenContent && (
            <motion.div
              style={{ opacity: fullScreenContentOpacity }}
              className="pointer-events-auto absolute inset-0 flex items-center justify-center p-6"
            >
              {fullScreenContent}
            </motion.div>
          )}
        </div>

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

// Backward compatibility alias
export { CardBlurReveal as CardCloudFlip, type CardBlurRevealProps as CardCloudFlipProps };
export default CardBlurReveal;
