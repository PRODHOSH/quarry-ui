"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { LivePreview } from "@/components/site/live-preview";

type T = { name: string; title: string; description: string; preview: string; tags: string[]; routes: number; files: number };

/** The grid of live previews. The sidebar sets the category and search through the URL. */
export function TemplatesBrowser({ templates }: { templates: T[] }) {
  const params = useSearchParams();
  const cat = params.get("category");
  const q = (params.get("q") ?? "").trim().toLowerCase();
  const shown = useMemo(
    () => templates.filter((t) => (!cat || t.tags.includes(cat)) && (!q || (t.title + t.description).toLowerCase().includes(q))),
    [templates, cat, q]
  );

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium tracking-tight">{cat ?? "All templates"}</h1>
          <p className="mt-1 text-sm text-muted-foreground">Full Next.js apps with real routes. Free to install.</p>
        </div>
        <p className="shrink-0 text-sm text-muted-foreground">{shown.length} {shown.length === 1 ? "template" : "templates"}</p>
      </div>

      <ul className="grid gap-x-6 gap-y-10 sm:grid-cols-2 2xl:grid-cols-3">
        {shown.map((t) => (
          <li key={t.name} className="group min-w-0">
            <div className="relative">
              <LivePreview src={t.preview} title={t.title} />
              <Link href={`/templates/${t.name}`} aria-label={`${t.title} details`} className="absolute inset-0 z-10 rounded-2xl" />
              <a href={t.preview} target="_blank" rel="noreferrer" className="absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs font-medium opacity-0 shadow-lg backdrop-blur transition-all duration-300 group-hover:opacity-100">
                View preview <ArrowUpRight className="size-3.5" />
              </a>
            </div>
            <div className="mt-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <Link href={`/templates/${t.name}`} className="block truncate font-medium hover:underline">{t.title}</Link>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.routes} pages · {t.files} files · {t.tags.filter((x) => x !== "Application").join(", ")}</p>
              </div>
              <span className="shrink-0 rounded-full border px-2.5 py-0.5 text-xs text-muted-foreground">Free</span>
            </div>
          </li>
        ))}
        {shown.length === 0 && <li className="col-span-full rounded-2xl border border-dashed p-10 text-center text-sm text-muted-foreground">No templates match.</li>}
        <li className="grid min-h-60 place-items-center rounded-2xl border border-dashed p-8 text-center">
          <div>
            <p className="font-medium">More on the way</p>
            <p className="mt-1 text-sm text-muted-foreground">Admin panel, SaaS and landing pages are next.</p>
            <Link href="/#waitlist" className="mt-4 inline-flex items-center gap-1 text-sm underline-offset-4 hover:underline">Join the waiting list <ArrowUpRight className="size-3.5" /></Link>
          </div>
        </li>
      </ul>
    </div>
  );
}
