import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ComponentCard } from "@/components/site/component-card";

type Item = { name: string; title: string; stage: "center" | "fill" };

function Row({ items, reverse = false, speed }: { items: Item[]; reverse?: boolean; speed: number }) {
  return (
    <div className="marquee group" style={{ "--marquee-speed": `${speed}s` } as React.CSSProperties}>
      {[0, 1].map((copy) => (
        <ul
          key={copy}
          aria-hidden={copy === 1 || undefined}
          inert={copy === 1 || undefined}
          className={`marquee-track ${reverse ? "marquee-reverse" : ""}`}
        >
          {items.map((item) => (
            <li key={item.name} className="w-[min(72vw,26rem)] shrink-0">
              <ComponentCard name={item.name} title={item.title} stage={item.stage} />
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

/** Two rows of live components drifting in opposite directions. Hover to pause. */
export function ComponentMarquee({ items, total }: { items: Item[]; total: number }) {
  const half = Math.ceil(items.length / 2);
  return (
    <div className="overflow-hidden">
      <div className="mx-auto mb-12 flex max-w-6xl items-end justify-between gap-6 px-6">
        <h2 className="text-balance text-4xl font-semibold leading-[1.06] tracking-[-0.03em] sm:text-5xl">
          {total} components,
          <br />
          always moving.
        </h2>
        <Link href="/components" className="group hidden items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
          Browse them all
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <div className="space-y-6 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <Row items={items.slice(0, half)} speed={90} />
        <Row items={items.slice(half)} reverse speed={110} />
      </div>
    </div>
  );
}
