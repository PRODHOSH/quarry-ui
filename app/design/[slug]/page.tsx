import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "lucide-react";
import { BookmarkButton } from "@/components/auth/bookmark-button";
import { CopyDesign, CopyHex } from "@/components/design/copy-button";
import { Markdown, headingsOf } from "@/components/design/markdown";
import { getDesign, getDesignIndex } from "@/lib/design";

export function generateStaticParams() {
  return getDesignIndex().map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const d = getDesign(slug);
  return d ? { title: `${d.name} design system`, description: d.tagline } : {};
}

export default async function DesignDetail({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDesign(slug);
  if (!d) notFound();

  const toc = headingsOf(d.body).filter((h) => h.level === 2);
  const kb = Math.round(d.bytes / 1024);

  return (
    <div className="mx-auto w-full max-w-6xl">
      <Link href="/design" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
        <ArrowLeft className="size-4" /> All design systems
      </Link>

      <header className="mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm text-muted-foreground">{d.category}</p>
          <h1 className="mt-1 text-4xl font-semibold tracking-tight sm:text-5xl">{d.name}</h1>
          <p className="mt-3 text-lg leading-relaxed text-muted-foreground">{d.tagline}</p>
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <BookmarkButton kind="design" slug={d.slug} variant="pill" />
          <CopyDesign slug={d.slug} />
          <a href={`/design-md/${d.slug}.md`} download={`DESIGN.md`} className="inline-flex h-10 items-center gap-2 rounded-full border px-5 text-sm font-medium transition-colors hover:bg-muted active:scale-95">
            <Download className="size-4" /> Download
          </a>
        </div>
      </header>

      <div className="mt-6 flex h-28 overflow-hidden rounded-2xl border">
        {d.swatch.map((hex) => (
          <span key={hex} className="flex-1" style={{ background: hex }} />
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted-foreground">
        <span>{d.colors.length} colour tokens</span>
        {d.fonts.length > 0 && <span>{d.fonts.join(", ")}</span>}
        <span>{kb} KB of guidance</span>
      </div>

      {d.colors.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-semibold tracking-tight">Palette</h2>
          <p className="mt-1 text-sm text-muted-foreground">Click a swatch to copy its value.</p>
          <ul className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {d.colors.map((c) => (
              <li key={c.key}>
                <CopyHex hex={c.value} style={{ background: c.value }} className="flex h-20 w-full items-end justify-start rounded-xl border p-2 text-left transition-transform hover:-translate-y-0.5">
                  <span className="sr-only">{c.key}</span>
                </CopyHex>
                <div className="mt-1.5 px-0.5">
                  <p className="truncate text-xs font-medium">{c.key}</p>
                  <p className="font-mono text-[11px] text-muted-foreground">{c.value}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-14 grid gap-12 xl:grid-cols-[minmax(0,1fr)_14rem]">
        <article className="min-w-0 max-w-3xl">
          <h2 className="mb-2 text-xl font-semibold tracking-tight">The full brief</h2>
          <Markdown source={d.body} />
        </article>

        <aside className="hidden xl:block">
          <nav aria-label="On this page" className="sticky top-24">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">On this page</p>
            <ul className="mt-3 space-y-1.5 border-l pl-3 text-sm">
              {toc.map((h) => (
                <li key={h.id}>
                  <a href={`#${h.id}`} className="block truncate text-muted-foreground transition-colors hover:text-foreground">{h.text}</a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      </div>
    </div>
  );
}
