"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { slug: string; title: string; group: string };

/** The list of pages beside the docs. On narrow screens it becomes a scrolling row above the page. */
export function DocsNav({ docs, groups, pdf }: { docs: Item[]; groups: readonly string[]; pdf: string }) {
  const path = usePathname();
  const active = path.split("/")[2] ?? "introduction";
  return (
    <>
      <nav aria-label="Documentation" className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-6 max-h-[calc(100svh-3rem)] overflow-y-auto pb-6 pr-2 scrollbar-none">
          {groups.map((g) => (
            <div key={g} className="mb-6">
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{g}</p>
              <ul className="space-y-px">
                {docs.filter((d) => d.group === g).map((d) => (
                  <li key={d.slug}>
                    <Link href={`/docs/${d.slug}`} aria-current={active === d.slug ? "page" : undefined} className={cn("block rounded-lg px-3 py-1.5 text-sm transition-colors", active === d.slug ? "bg-accent font-medium text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground")}>
                      {d.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <a href={pdf} download className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground">
            <Download className="size-4" /> Download PDF
          </a>
        </div>
      </nav>
      <nav aria-label="Documentation" className="-mx-4 mb-6 flex gap-1 overflow-x-auto px-4 pb-1 scrollbar-none lg:hidden">
        {docs.map((d) => (
          <Link key={d.slug} href={`/docs/${d.slug}`} aria-current={active === d.slug ? "page" : undefined} className={cn("shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors", active === d.slug ? "border-foreground bg-foreground text-background" : "text-muted-foreground")}>
            {d.title}
          </Link>
        ))}
      </nav>
    </>
  );
}
