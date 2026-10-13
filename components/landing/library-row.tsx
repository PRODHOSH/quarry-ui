import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ComponentCard } from "@/components/site/component-card";

type Item = { name: string; title: string; stage: "center" | "fill" };

/** One big row of live components, drifting left to right. Hover to pause. */
export function LibraryRow({ items }: { items: Item[] }) {
  return (
    <div className="overflow-hidden">
      <div className="mx-auto mb-10 flex max-w-6xl items-end justify-between gap-6 px-6">
        <div>
          <p className="font-label text-xs uppercase tracking-wide text-muted-foreground">The library</p>
          <h2 className="mt-3 text-balance text-4xl font-medium leading-[1.05] tracking-[-0.04em] sm:text-5xl">
            Every section, <span className="text-brand">live.</span>
          </h2>
        </div>
        <Link href="/components" className="font-label group hidden items-center gap-1.5 text-xs uppercase text-muted-foreground transition-colors hover:text-foreground sm:inline-flex">
          Browse all
          <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-px group-hover:translate-x-px" />
        </Link>
      </div>
      <div className="marquee group [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]" style={{ "--marquee-speed": "120s" } as React.CSSProperties}>
        {[0, 1].map((copy) => (
          <ul key={copy} aria-hidden={copy === 1 || undefined} inert={copy === 1 || undefined} className="marquee-track marquee-reverse !gap-6 !pr-6">
            {items.map((item) => (
              <li key={item.name} className="w-[min(86vw,40rem)] shrink-0">
                <ComponentCard name={item.name} title={item.title} stage={item.stage} />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
