import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Shelf } from "@/components/home/row";
import { ComponentCard } from "@/components/site/component-card";
import { LivePreview } from "@/components/site/live-preview";
import { getItem, getItems, ownerOf } from "@/lib/registry";
import { getDesign, getDesignIndex } from "@/lib/design";

const TOP = ["feature-bento", "hero-split", "command-menu", "pricing-cards", "testimonial-columns", "dock", "faq-search", "mega-footer"];
const BRANDS = ["stripe", "vercel", "linear", "notion", "claude", "spotify", "airbnb", "ferrari", "tesla", "apple"];

/** The home page: a welcome, then shelves of the best of each section, the way an app store lays it out. */
export function HomeDashboard() {
  const all = getItems();
  const of = (o: string) => all.filter((i) => ownerOf(i) === o);
  const top = TOP.map((n) => getItem(n)).filter((i): i is NonNullable<typeof i> => !!i);
  const fresh = of("components").slice(-8).reverse();
  const templates = of("templates");
  const backgrounds = of("backgrounds");
  const loaders = of("loaders");
  const designs = getDesignIndex();
  const brands = BRANDS.map((s) => designs.find((d) => d.slug === s)).filter((d): d is NonNullable<typeof d> => !!d);

  const stats = [
    [of("components").length, "components", "/components"],
    [templates.length, "templates", "/templates"],
    [backgrounds.length, "backgrounds", "/backgrounds"],
    [loaders.length, "loaders", "/loaders"],
    [designs.length, "design systems", "/design"],
  ] as const;

  return (
    <div className="mx-auto max-w-[88rem]">
      <header className="max-w-3xl">
        <h1 className="flex flex-wrap items-center gap-x-4 gap-y-2 text-5xl font-semibold leading-[1.02] tracking-tight sm:text-6xl">
          Welcome to
          <Image src="/brand/logo.png" alt="Quarry UI" width={1738} height={389} priority className="h-12 w-auto sm:h-[3.6rem]" />
        </h1>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Free components, full app templates, backgrounds and design systems with real motion. Copy them into your project with one command and make them yours.
        </p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {stats.map(([n, label, href]) => (
            <li key={label}>
              <Link href={href} className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3.5 py-1.5 text-sm transition-colors hover:border-foreground/30">
                <span className="font-semibold tabular-nums">{n}</span>
                <span className="text-muted-foreground">{label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </header>

      <div className="mt-14">
        <Shelf title="Most loved" text="The components people reach for first" href="/components">
          {top.map((item, i) => (
            <li key={item.name} className="flex shrink-0 items-center">
              <span aria-hidden className="-mr-5 select-none text-[8.5rem] font-semibold leading-none tracking-tighter text-foreground/[0.07]">{i + 1}</span>
              <ComponentCard name={item.name} title={item.title} stage={item.meta.stage} theme={item.meta.theme} className="relative w-[19rem]" />
            </li>
          ))}
        </Shelf>

        <Shelf title="New and noteworthy" text="Fresh from the last few days" href="/components">
          {fresh.map((item) => (
            <li key={item.name} className="w-[19rem] shrink-0">
              <ComponentCard name={item.name} title={item.title} stage={item.meta.stage} theme={item.meta.theme} />
            </li>
          ))}
        </Shelf>

        <Shelf title="Templates" text="Whole apps you install and make your own" href="/templates">
          {templates.map((t) => (
            <li key={t.name} className="group relative w-[26rem] shrink-0">
              <div className="transition-transform duration-300 group-hover:-translate-y-1">
                <LivePreview src={t.meta.preview ?? ""} title={t.title} />
              </div>
              <p className="mt-3 flex items-center justify-between text-sm text-muted-foreground transition-colors group-hover:text-foreground">
                {t.title} <ArrowUpRight className="size-4" />
              </p>
              <Link href={`/templates/${t.name}`} aria-label={t.title} className="absolute inset-0 z-10 rounded-xl" />
            </li>
          ))}
        </Shelf>

        <Shelf title="Backgrounds" text="Live canvases you can tune in the browser" href="/backgrounds">
          {backgrounds.map((item) => (
            <li key={item.name} className="w-[19rem] shrink-0">
              <ComponentCard name={item.name} title={item.title} stage={item.meta.stage} theme={item.meta.theme} base="/backgrounds" />
            </li>
          ))}
        </Shelf>

        <Shelf title="Loaders" text="Small loading motions for every state" href="/loaders">
          {loaders.slice(0, 10).map((item) => (
            <li key={item.name} className="w-[13rem] shrink-0">
              <ComponentCard name={item.name} title={item.title} stage={item.meta.stage} theme={item.meta.theme} base="/loaders" />
            </li>
          ))}
        </Shelf>

        <Shelf title="Design systems" text="DESIGN.md briefs your AI tool can read" href="/design">
          {brands.map((b) => {
            const d = getDesign(b.slug);
            return (
              <li key={b.slug} className="w-[15rem] shrink-0">
                <Link href={`/design/${b.slug}`} className="group block rounded-2xl border bg-card p-3 transition-colors hover:border-foreground/30">
                  <div className="flex h-20 overflow-hidden rounded-xl border">
                    {d?.swatch.map((hex, i) => <span key={hex + i} className="h-full flex-1" style={{ background: hex }} />)}
                  </div>
                  <p className="mt-3 px-1 text-sm font-medium">{b.name}</p>
                  <p className="px-1 text-xs text-muted-foreground">{b.category}</p>
                </Link>
              </li>
            );
          })}
        </Shelf>
      </div>
    </div>
  );
}
