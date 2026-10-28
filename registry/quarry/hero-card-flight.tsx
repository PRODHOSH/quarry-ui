"use client";

import React, { useEffect, useRef, useMemo, useCallback } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * HeroCardFlight — Scroll-Driven Card Flight & Landing Animation
 *
 * Standalone UI Component for Quarry UI.
 * Cards fan out in the hero deck and fly along smooth parabolic bezier curves
 * down into their destination grid slots as the user scrolls.
 * ───────────────────────────────────────────────────────────────────────────── */

export interface HeroFlightItem {
  id: string;
  title: string;
  subtitle?: string;
  price?: string;
  badge?: string;
  image: string;
  link?: string;
}

export interface HeroCardFlightProps {
  /** Items to animate from the hero deck into the destination grid. */
  items?: HeroFlightItem[];
  /** Card width in pixels. Default: 250 */
  cardWidth?: number;
  /** Hero title text */
  heroTitle?: React.ReactNode;
  /** Hero subtitle / description */
  heroSubtitle?: string;
  /** Primary CTA button text */
  primaryCtaText?: string;
  /** Primary CTA click handler */
  onPrimaryCtaClick?: () => void;
  /** Secondary CTA button text */
  secondaryCtaText?: string;
  /** Secondary CTA click handler */
  onSecondaryCtaClick?: () => void;
  /** Landing section heading */
  gridTitle?: string;
  /** Landing section eyebrow label */
  gridEyebrow?: string;
  /** Optional custom card renderer */
  renderCard?: (item: HeroFlightItem) => React.ReactNode;
  /** Container custom class name */
  className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * MATHEMATICAL FLIGHT PHYSICS & CURVES (Pure functions)
 * ───────────────────────────────────────────────────────────────────────────── */

export type FlightSeed = {
  curveX: number;
  lift: number;
  startRotation: number;
  scaleBoost: number;
  stagger: number;
};

/** Deterministic pseudo-random fraction in [0, 1) based on item ID and salt. */
function seededUnit(seed: string, salt: number): number {
  let h = 2166136261 ^ salt;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return ((h >>> 0) % 100000) / 100000;
}

/** Generates tasteful flight parameters ensuring natural fan-out and un-twisting. */
function flightSeedFor(id: string, index: number, total: number): FlightSeed {
  const a = seededUnit(id, 1);
  const b = seededUnit(id, 2);
  const c = seededUnit(id, 3);

  // Alternate tilt down the deck: card 0 tilts right, card 1 tilts left, etc.
  const tiltDirection = index % 2 === 0 ? 1 : -1;
  const startRotation = tiltDirection * (5 + c * 4);
  const curveX = tiltDirection * (70 + a * 70);

  return {
    curveX,
    lift: 90 + b * 130,
    startRotation,
    scaleBoost: 0.04 + a * 0.05,
    stagger: total > 1 ? (index / total) * 0.18 : 0,
  };
}

const clamp01 = (n: number) => (n < 0 ? 0 : n > 1 ? 1 : n);

/** Cubic ease in-out without overshoot for silky luxury motion. */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function cardProgress(rawProgress: number, stagger: number): number {
  const span = 1 - stagger;
  if (span <= 0) return rawProgress >= 1 ? 1 : 0;
  return easeInOutCubic(clamp01((rawProgress - stagger) / span));
}

function quadratic(from: number, control: number, to: number, t: number): number {
  const inv = 1 - t;
  return inv * inv * from + 2 * inv * t * control + t * t * to;
}

function flightFrame(
  from: { x: number; y: number },
  to: { x: number; y: number },
  seed: FlightSeed,
  t: number
) {
  const controlX = (from.x + to.x) / 2 + seed.curveX;
  const controlY = (from.y + to.y) / 2 - seed.lift;

  return {
    x: quadratic(from.x, controlX, to.x, t),
    y: quadratic(from.y, controlY, to.y, t),
    rotation: seed.startRotation * (1 - t),
    scale: 1 + seed.scaleBoost * Math.sin(Math.PI * t),
  };
}

/** The nearest ancestor that scrolls, or the window. */
function scrollParent(el: HTMLElement | null): HTMLElement | Window {
  let p = el?.parentElement ?? null;
  while (p) {
    const o = getComputedStyle(p).overflowY;
    if ((o === "auto" || o === "scroll") && p.scrollHeight > p.clientHeight) return p;
    p = p.parentElement;
  }
  return window;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * DEFAULT SAMPLE DATA
 * ───────────────────────────────────────────────────────────────────────────── */

const DEFAULT_ITEMS: HeroFlightItem[] = [
  {
    id: "card-1",
    title: "Celestial Brass Chrono",
    subtitle: "Limited Edition",
    price: "$480",
    badge: "Bestseller",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "card-2",
    title: "Obsidian Heritage Flask",
    subtitle: "Artisanal Forge",
    price: "$240",
    badge: "New",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "card-3",
    title: "Amber Mineral Vessel",
    subtitle: "Hand-Blown Glass",
    price: "$320",
    badge: "Crafted",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80",
  },
  {
    id: "card-4",
    title: "Sculpted Walnut Stand",
    subtitle: "Natural Matte",
    price: "$195",
    image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&auto=format&fit=crop&q=80",
  },
];

/* ─────────────────────────────────────────────────────────────────────────────
 * DEFAULT PRESENTATIONAL CARD
 * ───────────────────────────────────────────────────────────────────────────── */

export function DefaultFlightCard({
  item,
  width,
}: {
  item: HeroFlightItem;
  width: number;
}) {
  return (
    <div
      style={{ width }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card text-card-foreground shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-xl"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-muted">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent opacity-60" />

        {item.badge && (
          <span className="absolute left-3 top-3 rounded-full border border-primary/30 bg-background/80 px-2.5 py-0.5 text-[10px] font-medium tracking-wider uppercase text-primary backdrop-blur-md">
            {item.badge}
          </span>
        )}
      </div>

      <div className="flex flex-col p-4">
        <h4 className="truncate font-medium text-sm text-foreground">{item.title}</h4>
        {item.subtitle && (
          <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
            {item.subtitle}
          </p>
        )}
        {item.price && (
          <div className="mt-3 flex items-baseline justify-between border-t border-border/80 pt-2">
            <span className="font-semibold text-sm text-primary">{item.price}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
              Available
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * MAIN HERO CARD FLIGHT COMPONENT
 * ───────────────────────────────────────────────────────────────────────────── */

export function HeroCardFlight({
  items = DEFAULT_ITEMS,
  cardWidth = 250,
  heroTitle,
  heroSubtitle = "Explore handcrafted creations that seamlessly travel from our design studio right into your collection.",
  primaryCtaText = "Explore Collection",
  onPrimaryCtaClick,
  secondaryCtaText = "Learn More",
  onSecondaryCtaClick,
  gridTitle = "Curated Showcase",
  gridEyebrow = "Selected Artifacts",
  renderCard,
  className,
}: HeroCardFlightProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroDeckRef = useRef<HTMLDivElement>(null);
  const destGridRef = useRef<HTMLDivElement>(null);

  const heroCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const destCardRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const cloneRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Deck slot offsets for staggered stack
  const stepX = 5;
  const stepY = 6;
  const midIndex = (items.length - 1) / 2;

  const seeds = useMemo(() => {
    return items.map((item, i) => flightSeedFor(item.id, i, items.length));
  }, [items]);

  // Measurement cache
  const coordsRef = useRef<
    {
      id: string;
      from: { x: number; y: number };
      to: { x: number; y: number };
      seed: FlightSeed;
    }[]
  >([]);

  const measure = useCallback(() => {
    const root = rootRef.current;
    if (!root) return;
    const rootRect = root.getBoundingClientRect();

    const nextCoords: typeof coordsRef.current = [];

    items.forEach((item, index) => {
      const heroEl = heroCardRefs.current.get(item.id);
      const destEl = destCardRefs.current.get(item.id);
      if (!heroEl || !destEl) return;

      const heroRect = heroEl.getBoundingClientRect();
      const destRect = destEl.getBoundingClientRect();

      nextCoords.push({
        id: item.id,
        from: {
          x: heroRect.left - rootRect.left + heroRect.width / 2,
          y: heroRect.top - rootRect.top + heroRect.height / 2,
        },
        to: {
          x: destRect.left - rootRect.left + destRect.width / 2,
          y: destRect.top - rootRect.top + destRect.height / 2,
        },
        seed: seeds[index] ?? flightSeedFor(item.id, index, items.length),
      });
    });

    coordsRef.current = nextCoords;
  }, [items, seeds]);

  useEffect(() => {
    if (items.length === 0) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    measure();
    const scroller = scrollParent(rootRef.current);
    let rafId = 0;

    const render = () => {
      rafId = 0;
      const root = rootRef.current;
      const heroDeck = heroDeckRef.current;
      const destGrid = destGridRef.current;
      if (!root || !heroDeck || !destGrid || coordsRef.current.length === 0) return;

      const scrollerTop = scroller instanceof Window ? 0 : scroller.getBoundingClientRect().top;
      const viewHeight = scroller instanceof Window ? window.innerHeight : scroller.clientHeight;

      const heroBox = heroDeck.getBoundingClientRect();
      const destBox = destGrid.getBoundingClientRect();

      // Flight starts as hero deck moves above viewport center
      const heroCenterY = heroBox.top - scrollerTop + heroBox.height / 2;
      // Flight finishes when destination grid is comfortably in view
      const destCenterY = destBox.top - scrollerTop + destBox.height / 2;

      const startDist = viewHeight * 0.45;
      const endDist = viewHeight * 0.55;

      // Calculate normalised progress between startDist and endDist
      const totalSpan = Math.max(1, (heroCenterY - destCenterY) + (startDist - endDist));
      const currentSpan = heroCenterY - endDist;
      const rawProgress = clamp01(1 - currentSpan / totalSpan);

      for (const entry of coordsRef.current) {
        const cloneEl = cloneRefs.current.get(entry.id);
        const heroEl = heroCardRefs.current.get(entry.id);
        const destEl = destCardRefs.current.get(entry.id);

        if (!cloneEl || !heroEl || !destEl) continue;

        const t = cardProgress(rawProgress, entry.seed.stagger);
        const frame = flightFrame(entry.from, entry.to, entry.seed, t);

        if (t <= 0.001) {
          // Resting in hero deck
          cloneEl.style.display = "none";
          heroEl.style.visibility = "visible";
          destEl.style.visibility = "hidden";
        } else if (t >= 0.999) {
          // Landed in destination grid
          cloneEl.style.display = "none";
          heroEl.style.visibility = "hidden";
          destEl.style.visibility = "visible";
        } else {
          // In active flight
          cloneEl.style.display = "block";
          heroEl.style.visibility = "hidden";
          destEl.style.visibility = "hidden";

          cloneEl.style.transform = `translate3d(${frame.x - cardWidth / 2}px, ${
            frame.y - 170
          }px, 0) rotate(${frame.rotation}deg) scale(${frame.scale})`;
        }
      }
    };

    const onScrollOrResize = () => {
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    const onResize = () => {
      measure();
      onScrollOrResize();
    };

    scroller.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onResize);

    // Initial render tick
    onResize();

    return () => {
      scroller.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [items.length, cardWidth, measure]);

  const cardRenderer = (item: HeroFlightItem) =>
    renderCard ? renderCard(item) : <DefaultFlightCard item={item} width={cardWidth} />;

  return (
    <div
      ref={rootRef}
      className={cn("relative w-full overflow-hidden bg-background text-foreground", className)}
    >
      {/* ──────────────────────────────────────────
          1. FLOATING FLIGHT OVERLAY LAYER
          ────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-30 overflow-hidden"
      >
        {items.map((item) => (
          <div
            key={`clone-${item.id}`}
            ref={(el) => {
              if (el) cloneRefs.current.set(item.id, el);
              else cloneRefs.current.delete(item.id);
            }}
            className="absolute left-0 top-0 will-change-transform"
            style={{
              width: cardWidth,
              display: "none",
              transformOrigin: "50% 50%",
              backfaceVisibility: "hidden",
            }}
          >
            {cardRenderer(item)}
          </div>
        ))}
      </div>

      {/* ──────────────────────────────────────────
          2. HERO SECTION WITH CARD STACK
          ────────────────────────────────────────── */}
      <section className="relative px-6 pb-28 pt-16 sm:px-10 md:pb-36 md:pt-24 lg:px-16">
        {/* Subtle atmospheric backdrop */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-[10%] right-0 size-[500px] rounded-full bg-primary/5 blur-[120px]" />
          <div className="absolute left-0 top-1/2 size-[400px] rounded-full bg-primary/5 blur-[140px]" />
          <div className="absolute inset-0 bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
        </div>

        <div className="relative mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Hero Copy */}
          <div className="z-10 flex flex-col items-start lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
              <span className="size-1.5 rounded-full bg-primary animate-pulse" />
              Scroll To Experience Flight
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.08]">
              {heroTitle || (
                <>
                  Sculpted Artifacts in{" "}
                  <span className="font-serif italic font-normal text-primary">
                    Motion
                  </span>
                </>
              )}
            </h1>

            <p className="mt-6 max-w-lg text-base font-normal leading-relaxed text-muted-foreground sm:text-lg">
              {heroSubtitle}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onPrimaryCtaClick}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform duration-200 hover:scale-105 active:scale-95"
              >
                {primaryCtaText} <ArrowUpRight className="size-4" />
              </button>
              <button
                type="button"
                onClick={onSecondaryCtaClick}
                className="rounded-full border border-border bg-background/80 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
              >
                {secondaryCtaText}
              </button>
            </div>
          </div>

          {/* Hero Stack Deck */}
          <div ref={heroDeckRef} className="z-10 flex justify-center lg:col-span-6">
            <div
              className="relative mx-auto h-[380px] w-full max-w-[440px] sm:h-[420px]"
              aria-label="Featured card deck"
            >
              {items.map((item, i) => {
                const seed = seeds[i] ?? flightSeedFor(item.id, i, items.length);
                const leftPercent = 50 + (i - midIndex) * stepX;
                const topPercent = 50 + (i - midIndex) * stepY;

                return (
                  <div
                    key={`hero-${item.id}`}
                    ref={(el) => {
                      if (el) heroCardRefs.current.set(item.id, el);
                      else heroCardRefs.current.delete(item.id);
                    }}
                    className="absolute"
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                      width: cardWidth,
                      transform: `translate3d(-50%, -50%, 0) rotate(${seed.startRotation}deg)`,
                      zIndex: 10 + (items.length - i),
                    }}
                  >
                    {cardRenderer(item)}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ──────────────────────────────────────────
          3. DESTINATION LANDING GRID
          ────────────────────────────────────────── */}
      <section
        ref={destGridRef}
        className="relative border-t border-border bg-muted/20 px-6 py-28 sm:px-10 lg:px-16"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mb-14 text-center">
            {gridEyebrow && (
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-primary">
                {gridEyebrow}
              </p>
            )}
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {gridTitle}
            </h2>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
            {items.map((item) => (
              <div
                key={`dest-${item.id}`}
                ref={(el) => {
                  if (el) destCardRefs.current.set(item.id, el);
                  else destCardRefs.current.delete(item.id);
                }}
                className="shrink-0 transition-transform duration-300 hover:-translate-y-1"
                style={{ width: cardWidth }}
              >
                {cardRenderer(item)}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HeroCardFlight;
