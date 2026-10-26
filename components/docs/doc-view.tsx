import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { DocBlocks, slugify } from "@/components/docs/blocks";
import { getDocs, type Doc } from "@/lib/docs";

export function DocView({ doc }: { doc: Doc }) {
  const all = getDocs();
  const i = all.findIndex((d) => d.slug === doc.slug);
  const prev = all[i - 1];
  const next = all[i + 1];
  const toc = doc.blocks.filter((b) => b.t === "h3").map((b) => (b.t === "h3" ? b.text : ""));

  return (
    <div className="flex gap-12">
      <article className="min-w-0 flex-1 pb-16">
        <header>
          <p className="text-sm font-medium text-muted-foreground">{doc.group}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{doc.title}</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">{doc.lead}</p>
        </header>
        <div className="mt-10 max-w-3xl">
          <DocBlocks blocks={doc.blocks} />
        </div>
        <footer className="mt-14 grid max-w-3xl gap-3 border-t pt-6 sm:grid-cols-2">
          {prev ? (
            <Link href={`/docs/${prev.slug}`} className="group rounded-xl border p-4 transition-colors hover:border-foreground/30">
              <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><ArrowLeft className="size-3.5" /> Previous</span>
              <span className="mt-1 block font-medium">{prev.title}</span>
            </Link>
          ) : <span />}
          {next && (
            <Link href={`/docs/${next.slug}`} className="group rounded-xl border p-4 text-right transition-colors hover:border-foreground/30">
              <span className="flex items-center justify-end gap-1.5 text-xs text-muted-foreground">Next <ArrowRight className="size-3.5" /></span>
              <span className="mt-1 block font-medium">{next.title}</span>
            </Link>
          )}
        </footer>
      </article>
      {toc.length > 1 && (
        <aside aria-label="On this page" className="hidden w-48 shrink-0 xl:block">
          <div className="sticky top-6">
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">On this page</p>
            <ul className="space-y-2 border-l pl-4 text-sm">
              {toc.map((t) => (
                <li key={t}><a href={`#${slugify(t)}`} className="text-muted-foreground transition-colors hover:text-foreground">{t}</a></li>
              ))}
            </ul>
          </div>
        </aside>
      )}
    </div>
  );
}
