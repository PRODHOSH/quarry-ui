"use client";

import { useEffect, useRef, type ReactNode } from "react";
import type Matter from "matter-js";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type FooterColumn = { title: string; links: { label: string; href: string }[] };
export type Tile = { bg: string; fg: string; outline?: boolean };
export type Social = { label: string; href: string; path: string };

const COLUMNS: FooterColumn[] = [
  { title: "Company", links: [{ label: "Home", href: "#" }, { label: "About", href: "#" }, { label: "Services", href: "#" }, { label: "Portfolio", href: "#" }, { label: "Contact", href: "#" }] },
  { title: "Portfolio", links: [{ label: "Logo design", href: "#" }, { label: "Corporate identity", href: "#" }, { label: "Brochures and leaflets", href: "#" }, { label: "Banners", href: "#" }, { label: "Packaging", href: "#" }] },
];
const CONTACT = [
  { label: "Call us at", value: "+1 555 010 2030", href: "tel:+15550102030" },
  { label: "Email us at", value: "hello@northwind.studio", href: "mailto:hello@northwind.studio" },
  { label: "Visit us", value: "12 Market Street, Chennai, India" },
];
const SOCIALS: Social[] = [
  { label: "Facebook", href: "#", path: "M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.5V4.4c-.3 0-1.2-.1-2.2-.1-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.7V21h2.8Z" },
  { label: "LinkedIn", href: "#", path: "M6.9 8.8H4v10h2.9v-10ZM5.5 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4ZM20 13.3c0-2.7-1.4-4.7-3.9-4.7-1.2 0-2.1.6-2.6 1.3V8.8h-2.9v10h2.9v-5.2c0-1.4.7-2.2 1.8-2.2s1.6.8 1.6 2.2v5.2H20v-5.5Z" },
  { label: "X", href: "#", path: "M17.8 3h3.1l-6.8 7.7L22 21h-6.2l-4.9-6.3L5.3 21H2.2l7.2-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" },
  { label: "Pinterest", href: "#", path: "M12 2a10 10 0 0 0-3.6 19.3c-.1-.8-.2-2 0-2.9l1.2-5s-.3-.6-.3-1.5c0-1.4.8-2.5 1.8-2.5.9 0 1.3.7 1.3 1.4 0 .9-.5 2.2-.8 3.4-.2 1 .5 1.8 1.5 1.8 1.8 0 3.2-1.9 3.2-4.7 0-2.4-1.8-4.2-4.3-4.2-2.9 0-4.7 2.2-4.7 4.5 0 .9.3 1.8.8 2.3.1.1.1.2.1.3l-.3 1.2c0 .2-.1.2-.3.1-1.2-.6-2-2.4-2-3.9 0-3.2 2.3-6.1 6.7-6.1 3.5 0 6.2 2.5 6.2 5.8 0 3.5-2.2 6.3-5.2 6.3-1 0-2-.5-2.3-1.2l-.6 2.4c-.2.9-.8 2-1.3 2.7A10 10 0 1 0 12 2Z" },
];
const TAGS = ["Logo designing", "Corporate identities", "Brochure designing", "Banner designing", "Outdoor media", "Package design", "Leaflet designing", "Website designing", "Signage design", "Corporate films", "Social media creatives", "Digital marketing", "Printing and display stands", "Labels and stickers", "Plastic cards"];
const TAG_COLORS: Tile[] = [
  { bg: "var(--background)", fg: "var(--foreground)" },
  { bg: "var(--ring)", fg: "#fff" },
  { bg: "var(--primary)", fg: "var(--primary-foreground)" },
  { bg: "transparent", fg: "var(--background)", outline: true },
  { bg: "color-mix(in oklab, var(--ring) 55%, #29b6ff)", fg: "#fff" },
  { bg: "color-mix(in oklab, var(--primary) 45%, #fff)", fg: "var(--foreground)" },
];
/** The order the colours repeat in, so neighbouring pills rarely match. */
const ORDER = [0, 1, 2, 3, 4, 5, 0, 2, 1, 3, 0, 4, 2, 3, 1];
const TILE_COLORS: Tile[] = [
  { bg: "var(--primary)", fg: "var(--foreground)" },
  { bg: "var(--card)", fg: "var(--foreground)" },
  { bg: "color-mix(in oklab, var(--primary) 40%, var(--foreground))", fg: "var(--primary)" },
  { bg: "color-mix(in oklab, var(--foreground) 70%, var(--background))", fg: "var(--primary)" },
];

function Spark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <path fill="currentColor" d="M16 2c.6 8 5.7 13.4 14 14-8.3.6-13.4 6-14 14-.6-8-5.7-13.4-14-14C10.3 15.4 15.4 10 16 2Z" />
    </svg>
  );
}

/**
 * A footer with a pile of real physics at the bottom. Service tags (or square tiles) drop in when it
 * scrolls into view and settle on the floor. On a mouse you can grab and throw them. Tags still open
 * their link when clicked, and a drag never counts as a click. Reduced motion shows a still pile,
 * and without JavaScript the tags simply wrap like a tag cloud.
 */
export function PhysicsFooter({
  title = "Let’s make your brand shine.",
  lead = "Tell us about your brand, your product or your next campaign. We will come back to you soon.",
  cta = { label: "Start a project", href: "#" },
  contact = CONTACT,
  socials = SOCIALS,
  columns = COLUMNS,
  pile = "tags",
  tags = TAGS,
  tagColors = TAG_COLORS,
  tileColors = TILE_COLORS,
  hover = "color-mix(in oklab, var(--primary) 40%, var(--background))",
  tagsTitle = "All our services",
  tagsHint = "Drag them around, or tap one to read more.",
  mark,
  brand = "Northwind",
  legal = "© 2026 Northwind Studio. All rights reserved.",
  legalLinks = [{ label: "Site map", href: "#" }, { label: "Terms", href: "#" }, { label: "Privacy policy", href: "#" }],
  className,
}: {
  title?: string;
  lead?: string;
  cta?: { label: string; href: string };
  contact?: { label: string; value: string; href?: string }[];
  socials?: Social[];
  columns?: FooterColumn[];
  /** `tags` drops link pills, `tiles` drops rounded squares with a mark. */
  pile?: "tiles" | "tags";
  tags?: string[];
  /** Pill colours. They repeat in a mixed order. `outline` draws a ring instead of a fill. */
  tagColors?: Tile[];
  tileColors?: Tile[];
  /** The colour a pill turns when the pointer is over it. */
  hover?: string;
  tagsTitle?: string;
  tagsHint?: string;
  /** The glyph inside each tile. Defaults to a four point spark. */
  mark?: ReactNode;
  brand?: ReactNode;
  legal?: string;
  legalLinks?: { label: string; href: string }[];
  className?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const moved = useRef(0);
  const down = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let dead = false;
    let teardown: (() => void) | null = null;

    import("matter-js").then((mod) => {
      if (dead) return;
      const M: typeof Matter = mod.default;
      const { Engine, Runner, Bodies, Body, Composite, Events, Mouse, MouseConstraint } = M;
      const nodes = Array.from(el.querySelectorAll<HTMLElement>("[data-piece]"));
      let engine: Matter.Engine | null = null;
      let runner: Matter.Runner | null = null;
      let parts: { node: HTMLElement; body: Matter.Body; w: number; h: number }[] = [];
      let visible = false;
      let built = false;
      let lastW = 0;
      let timer = 0;

      const reset = () => {
        if (runner) Runner.stop(runner);
        if (engine) {
          Composite.clear(engine.world, false);
          Engine.clear(engine);
        }
        engine = null;
        runner = null;
        parts = [];
        built = false;
        el.dataset.live = "false";
        if (pile === "tags") el.style.height = "";
        nodes.forEach((n) => (n.style.transform = ""));
      };

      const build = () => {
        reset();
        const cw = el.clientWidth;
        if (cw < 120) return;
        let ch = el.clientHeight;
        const dims = nodes.map((n) => {
          const r = n.getBoundingClientRect();
          return { w: Math.ceil(r.width), h: Math.ceil(r.height) };
        });
        if (pile === "tags") {
          const area = dims.reduce((s, d) => s + d.w * d.h, 0);
          ch = Math.min(560, Math.max(220, Math.ceil(area / 0.5 / cw) + 40));
          el.style.height = `${ch}px`;
        }
        el.dataset.live = "true";
        built = true;
        const eng = Engine.create({ gravity: { x: 0, y: pile === "tags" ? 1.05 : 1.15 } });
        engine = eng;
        const t = 200;
        Composite.add(eng.world, [
          Bodies.rectangle(cw / 2, ch + t / 2, cw * 3, t, { isStatic: true }),
          Bodies.rectangle(-t / 2, ch / 2, t, ch * 8, { isStatic: true }),
          Bodies.rectangle(cw + t / 2, ch / 2, t, ch * 8, { isStatic: true }),
        ]);
        nodes.forEach((node, i) => {
          const { w, h } = dims[i];
          const body = Bodies.rectangle(w / 2 + Math.random() * Math.max(1, cw - w), -h - i * (reduced ? 0 : 70), w, h, {
            chamfer: { radius: pile === "tags" ? h / 2 : w * 0.22 },
            restitution: pile === "tags" ? 0.25 : 0.38,
            friction: pile === "tags" ? 0.8 : 0.35,
            frictionAir: pile === "tags" ? 0.006 : 0.004,
            angle: (Math.random() - 0.5) * (pile === "tags" ? 0.22 : Math.PI * 2),
          });
          Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.08);
          if (reduced) Body.setPosition(body, { x: body.position.x, y: ch * 0.2 + Math.random() * ch * 0.4 });
          Composite.add(eng.world, body);
          parts.push({ node, body, w, h });
        });
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          const mouse = Mouse.create(el) as Matter.Mouse & { mousewheel: EventListener };
          mouse.element.removeEventListener("mousewheel", mouse.mousewheel);
          mouse.element.removeEventListener("DOMMouseScroll", mouse.mousewheel);
          Composite.add(eng.world, MouseConstraint.create(eng, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } as Matter.IConstraintDefinition }));
        }
        const paint = () =>
          parts.forEach(({ node, body, w, h }) => {
            node.style.transform = `translate3d(${(body.position.x - w / 2).toFixed(1)}px,${(body.position.y - h / 2).toFixed(1)}px,0) rotate(${body.angle.toFixed(3)}rad)`;
          });
        Events.on(eng, "afterUpdate", paint);
        if (reduced) {
          for (let i = 0; i < 480; i++) Engine.update(eng, 1000 / 60);
          paint();
          return;
        }
        runner = Runner.create();
        paint();
        if (visible) Runner.run(runner, eng);
      };

      const ro = new ResizeObserver(() => {
        const w = el.clientWidth;
        if (!built || w === lastW) {
          lastW = w;
          return;
        }
        lastW = w;
        window.clearTimeout(timer);
        timer = window.setTimeout(build, 250);
      });
      ro.observe(el);
      const io = new IntersectionObserver(
        ([en]) => {
          visible = en.isIntersecting;
          if (visible && !built) {
            lastW = el.clientWidth;
            build();
          } else if (runner && engine) {
            if (visible) Runner.run(runner, engine);
            else Runner.stop(runner);
          }
        },
        { threshold: 0.25 }
      );
      io.observe(el);
      teardown = () => {
        window.clearTimeout(timer);
        ro.disconnect();
        io.disconnect();
        reset();
      };
    });

    return () => {
      dead = true;
      teardown?.();
    };
  }, [pile, tags, tileColors, tagColors]);

  const count = 26;
  const guard = (e: React.MouseEvent) => {
    if (moved.current > 8) e.preventDefault();
  };

  return (
    <footer className={cn("relative overflow-clip rounded-t-[1.75rem] bg-foreground text-background", className)} style={{ ["--pill-hover" as string]: hover }}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: "radial-gradient(50% 60% at 12% 0%, color-mix(in oklab, var(--ring) 38%, transparent), transparent 70%)" }} />
      <div className="relative mx-auto grid max-w-[110rem] gap-[clamp(2rem,6vw,7.5rem)] px-[clamp(1rem,3.2vw,3rem)] pb-[clamp(1.5rem,3vw,2.5rem)] pt-[clamp(3.5rem,8vw,7rem)] lg:grid-cols-[1.1fr_1fr]">
        <div>
          <h2 className="max-w-[13ch] text-[clamp(1.9rem,1rem+3.4vw,4.2rem)] font-medium leading-[1.04] tracking-[-0.035em]">{title}</h2>
          <p className="mb-6 mt-5 max-w-[38ch] text-background/70">{lead}</p>
          <a href={cta.href} className="inline-flex h-[46px] items-center gap-2.5 rounded-xl bg-background pl-5 pr-2.5 text-sm font-semibold text-foreground transition-transform active:scale-95">
            {cta.label}
            <span className="grid size-[26px] place-items-center rounded-lg bg-primary text-primary-foreground transition-transform group-hover:rotate-45"><ArrowUpRight className="size-[13px]" /></span>
          </a>
          <div className="mt-9 grid gap-[18px]">
            {contact.map((c) => (
              <div key={c.label} className="grid gap-0.5">
                <span className="text-sm font-semibold">{c.label}</span>
                {c.href ? <a href={c.href} className="w-fit text-background/70 transition-colors hover:text-primary">{c.value}</a> : <address className="not-italic text-background/70">{c.value}</address>}
              </div>
            ))}
            <ul aria-label="Follow us" className="mt-1.5 flex flex-wrap gap-2.5">
              {socials.map((so) => (
                <li key={so.label}>
                  <a href={so.href} aria-label={so.label} title={so.label} className="grid size-[46px] place-items-center rounded-xl bg-background/10 text-background transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-primary hover:text-primary-foreground">
                    <svg viewBox="0 0 24 24" aria-hidden className="size-5"><path fill="currentColor" d={so.path} /></svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 content-start gap-x-6 gap-y-9">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3.5 text-sm font-semibold">{col.title}</h3>
              <ul className="space-y-1.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="inline-block py-0.5 text-sm leading-relaxed text-background/70 transition-colors hover:text-primary">{l.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      {pile === "tags" && (
        <div className="relative mx-auto flex max-w-[110rem] flex-wrap items-baseline justify-between gap-x-6 gap-y-2 px-[clamp(1rem,3.2vw,3rem)] pb-[18px] pt-2">
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-background/55">{tagsTitle}</h3>
          <p className="text-sm text-background/50">{tagsHint}</p>
        </div>
      )}

      <div
        ref={box}
        data-live="false"
        onPointerDown={(e) => {
          moved.current = 0;
          down.current = { x: e.clientX, y: e.clientY };
        }}
        onPointerMove={(e) => {
          if (down.current) moved.current = Math.max(moved.current, Math.hypot(e.clientX - down.current.x, e.clientY - down.current.y));
        }}
        onPointerUp={() => (down.current = null)}
        className={cn(
          "relative mx-[clamp(1rem,3.2vw,3rem)] overflow-hidden",
          pile === "tiles" ? "h-[clamp(14rem,24vw,21rem)] cursor-grab touch-pan-y active:cursor-grabbing" : "flex min-h-[14rem] flex-wrap content-end gap-2.5 pb-7 touch-pan-y data-[live=true]:block data-[live=true]:cursor-grab data-[live=true]:pb-0 data-[live=true]:active:cursor-grabbing"
        )}
      >
        {pile === "tiles"
          ? Array.from({ length: count }, (_, i) => {
              const c = tileColors[i % tileColors.length];
              const size = 56 + ((i * 37) % 44);
              return (
                <div key={i} data-piece aria-hidden className="absolute left-0 top-0 grid select-none place-items-center rounded-[22%] will-change-transform" style={{ width: size, height: size, background: c.bg, color: c.fg }}>
                  {mark ?? <Spark className="size-[58%]" />}
                </div>
              );
            })
          : tags.map((t, i) => {
              const c = tagColors[ORDER[i % ORDER.length] % tagColors.length];
              return (
                <a
                  key={t}
                  data-piece
                  href="#"
                  onClick={guard}
                  draggable={false}
                  className="inline-flex h-[clamp(2.75rem,4.4vw,4.25rem)] select-none items-center whitespace-nowrap rounded-full px-[clamp(1.25rem,2.2vw,2.1rem)] text-[clamp(0.95rem,0.5rem+1.1vw,1.6rem)] font-medium tracking-[-0.03em] transition-[background-color,color,box-shadow] duration-200 will-change-transform hover:bg-[var(--pill-hover)]! hover:text-foreground! hover:shadow-none! [[data-live=true]_&]:absolute [[data-live=true]_&]:left-0 [[data-live=true]_&]:top-0"
                  style={{ background: c.bg, color: c.fg, boxShadow: c.outline ? "inset 0 0 0 1.5px color-mix(in oklab, var(--background) 45%, transparent)" : undefined }}
                >
                  {t}
                </a>
              );
            })}
      </div>

      <div className="relative mx-auto flex max-w-[110rem] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-background/10 px-[clamp(1rem,3.2vw,3rem)] pb-6 pt-5 text-xs text-background/55">
        <p className="text-base font-semibold tracking-tight text-background">{brand}</p>
        <p>{legal}</p>
        <p className="flex flex-wrap gap-[18px]">
          {legalLinks.map((l) => (
            <a key={l.label} href={l.href} className="transition-colors hover:text-primary">{l.label}</a>
          ))}
          <a href="#top" className="transition-colors hover:text-primary">Back to top ↑</a>
        </p>
      </div>
    </footer>
  );
}
