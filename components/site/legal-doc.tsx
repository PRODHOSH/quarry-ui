import type { ReactNode } from "react";

export type LegalSection = { title: string; body: ReactNode };

/** A clean reading layout for the legal pages: a title, the date, a short intro and numbered sections. */
export function LegalDoc({ title, updated, intro, sections }: { title: string; updated: string; intro: ReactNode; sections: LegalSection[] }) {
  return (
    <article className="mx-auto max-w-3xl pb-24">
      <header>
        <p className="text-sm font-medium text-muted-foreground">Last updated {updated}</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
        <div className="mt-5 space-y-3 text-lg leading-relaxed text-muted-foreground">{intro}</div>
      </header>

      <nav aria-label="Contents" className="mt-10 rounded-2xl border bg-card p-5">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">On this page</p>
        <ol className="mt-3 grid gap-x-8 gap-y-1.5 text-sm sm:grid-cols-2">
          {sections.map((s, i) => (
            <li key={s.title}>
              <a href={`#s${i + 1}`} className="text-muted-foreground transition-colors hover:text-foreground">
                <span className="mr-2 tabular-nums">{i + 1}.</span>{s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="mt-12 space-y-12">
        {sections.map((s, i) => (
          <section key={s.title} id={`s${i + 1}`} className="scroll-mt-24">
            <h2 className="text-xl font-semibold tracking-tight"><span className="mr-2 tabular-nums text-muted-foreground">{i + 1}.</span>{s.title}</h2>
            <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4 [&_li]:pl-1 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:list-disc [&_ul]:space-y-1.5 [&_ul]:pl-5">{s.body}</div>
          </section>
        ))}
      </div>
    </article>
  );
}
