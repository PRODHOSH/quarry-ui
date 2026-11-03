"use client";

import { type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type Tile = { src: string; ratio?: number };

const ID = [1015, 1025, 1043, 1035, 1039, 1036, 1050, 1060, 1074, 1084, 1080, 1069, 1062, 1067, 1011, 1027, 1005, 1012];
const RATIOS = [1.4, 0.8, 1.5, 1.2, 0.9, 1.6];
const TILES: Tile[] = ID.map((id, i) => ({ src: `https://picsum.photos/id/${id}/640/460`, ratio: RATIOS[i % RATIOS.length] }));

function Row({ tiles, speed, reverse }: { tiles: Tile[]; speed: number; reverse?: boolean }) {
  const group = (hidden?: boolean) => (
    <div className="flex shrink-0 gap-[clamp(0.6rem,1.2vw,1.1rem)] pr-[clamp(0.6rem,1.2vw,1.1rem)]" aria-hidden={hidden}>
      {tiles.map((t, i) => (
        <figure key={i} className="m-0 h-full shrink-0 overflow-hidden rounded-[0.65rem] bg-foreground/30" style={{ aspectRatio: t.ratio ?? 1.4 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={t.src} alt="" draggable={false} loading="lazy" className="size-full object-cover" />
        </figure>
      ))}
    </div>
  );
  return (
    <div
      className="flex h-full w-max min-h-0 will-change-transform motion-reduce:!animate-none"
      style={{ animation: `mosaic-drift ${speed}s linear infinite ${reverse ? "reverse" : "normal"}` }}
    >
      {group()}
      {group(true)}
    </div>
  );
}

/**
 * A hero with a tilted wall of pictures drifting behind it. Three rows slide sideways at different
 * speeds, one against the others, under a soft tint that keeps the headline readable. The tint and
 * the accent word follow your theme, and the pictures are yours to swap. Reduced motion stops the drift.
 */
export function MosaicHero({
  eyebrow = "Advertising · Branding · Digital marketing",
  title = "Success is what your brand speaks.",
  accent = "brand",
  lead = "We design and print brands that stand out, all under one roof.",
  primary = { label: "Start a project", href: "#" },
  secondary = { label: "See our work", href: "#" },
  stats = [{ value: "Since 2012", text: "Designing, printing and promoting brands." }, { value: "15 services", text: "From logos and print to films and digital." }],
  tiles = TILES,
  tint = "var(--foreground)",
  children,
  className,
}: {
  eyebrow?: string;
  title?: string;
  /** The word in the title that is drawn in the accent colour. */
  accent?: string;
  lead?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
  /** Two short facts pinned to the bottom corners. */
  stats?: { value: string; text: string }[];
  tiles?: Tile[];
  /** The colour laid over the wall. */
  tint?: string;
  children?: ReactNode;
  className?: string;
}) {
  const third = Math.ceil(tiles.length / 3);
  const rows = [tiles.slice(0, third), tiles.slice(third, third * 2), tiles.slice(third * 2)].map((r, i) => (r.length ? r : tiles.slice(i, i + third)));
  const hasAccent = !!accent && title.includes(accent);
  const [before, after] = hasAccent ? title.split(accent) : [title, ""];
  return (
    <section className={cn("relative isolate grid min-h-[34rem] w-full place-items-center overflow-hidden text-background", className)} style={{ background: tint }}>
      <style>{`@keyframes mosaic-drift{to{transform:translateX(-50%)}}`}</style>
      <div aria-hidden className="absolute -inset-x-[12%] -inset-y-[8%] -z-20 grid -rotate-[5deg] grid-rows-3 gap-[clamp(0.6rem,1.2vw,1.1rem)] max-sm:-inset-x-[30%]">
        {rows.map((r, i) => (
          <Row key={i} tiles={r} speed={[80, 100, 90][i]} reverse={i === 1} />
        ))}
      </div>
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background: `radial-gradient(62% 56% at 50% 48%, color-mix(in oklab, ${tint} 78%, transparent) 0%, color-mix(in oklab, ${tint} 62%, transparent) 62%, color-mix(in oklab, ${tint} 50%, transparent) 100%), linear-gradient(180deg, color-mix(in oklab, ${tint} 55%, transparent), transparent 30%, transparent 68%, color-mix(in oklab, ${tint} 85%, transparent))`,
        }}
      />
      {stats[0] && (
        <div className="absolute bottom-[clamp(1.5rem,4vw,3.2rem)] left-[clamp(1rem,3.2vw,3rem)] hidden max-w-[15rem] text-sm text-background/70 xl:block">
          <b className="mb-2 block text-[clamp(1.8rem,1.2rem+1.6vw,2.8rem)] font-medium leading-none tracking-[-0.04em] text-background">{stats[0].value}</b>
          {stats[0].text}
        </div>
      )}
      {stats[1] && (
        <div className="absolute bottom-[clamp(1.5rem,4vw,3.2rem)] right-[clamp(1rem,3.2vw,3rem)] hidden max-w-[15rem] text-right text-sm text-background/70 xl:block">
          <b className="mb-2 block text-[clamp(1.8rem,1.2rem+1.6vw,2.8rem)] font-medium leading-none tracking-[-0.04em] text-background">{stats[1].value}</b>
          {stats[1].text}
        </div>
      )}
      <div className="grid max-w-[min(72rem,94vw)] justify-items-center gap-[clamp(1rem,2.4vw,1.9rem)] px-[clamp(1rem,3.2vw,3rem)] pb-[clamp(3rem,7vw,8rem)] pt-[clamp(5rem,8vw,8rem)] text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
        <h1 className="text-balance text-[clamp(2.2rem,0.8rem+4.6vw,6.2rem)] font-semibold leading-[0.98] tracking-[-0.05em] text-background">
          {before}
          {hasAccent && <em className="not-italic text-primary">{accent}</em>}
          {after}
        </h1>
        <p className="max-w-[52ch] text-[clamp(1.05rem,0.98rem+0.4vw,1.3rem)] text-background/80">{lead}</p>
        <div className="flex flex-wrap justify-center gap-2.5">
          <a href={primary.href} className="inline-flex h-[46px] items-center gap-2.5 rounded-xl bg-primary pl-5 pr-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95">
            {primary.label}
            <span className="grid size-[26px] place-items-center rounded-lg bg-background/25"><ArrowUpRight className="size-[13px]" /></span>
          </a>
          <a href={secondary.href} className="inline-flex h-[46px] items-center rounded-xl bg-background/[0.06] px-5 text-sm font-semibold text-background shadow-[inset_0_0_0_1.5px_color-mix(in_oklab,var(--background)_40%,transparent)] backdrop-blur-sm transition-colors hover:bg-background/20">
            {secondary.label}
          </a>
        </div>
        {children}
      </div>
    </section>
  );
}
