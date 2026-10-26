import { DocBlocks } from "@/components/docs/blocks";
import { DOC_GROUPS, getDocs } from "@/lib/docs";
import { SITE_URL } from "@/lib/site";

export const metadata = { title: "Quarry UI Documentation", robots: { index: false } };

/** The documentation laid out for print: white, black logo, one page per topic. Rendered to a PDF by scripts/make-docs-pdf.mjs. */
export default function DocsPdf() {
  const docs = getDocs();
  const host = SITE_URL.replace(/^https?:\/\//, "");
  return (
    <div
      className="light bg-white text-neutral-900"
      style={{ colorScheme: "light", fontFamily: "var(--font-figtree), ui-sans-serif, system-ui, sans-serif", WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}
    >
      <section className="flex min-h-[250mm] flex-col justify-between break-after-page py-6">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo-black.png" alt="Quarry UI" className="h-11 w-auto self-start" />
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-500">Documentation</p>
          <h1 className="mt-4 max-w-xl text-[56px] font-semibold leading-[1.02] tracking-tight text-neutral-950">Build with Quarry UI</h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-600">Install, theme and customise free React components, templates, backgrounds and loaders. Everything you copy becomes your own code.</p>
        </div>
        <div className="flex items-end justify-between border-t border-neutral-200 pt-5 text-sm text-neutral-500">
          <span>{host}</span>
          <span>MIT License</span>
        </div>
      </section>

      <section className="break-after-page py-4">
        <h2 className="text-3xl font-semibold tracking-tight text-neutral-950">Contents</h2>
        <div className="mt-8 space-y-8">
          {DOC_GROUPS.map((g) => (
            <div key={g}>
              <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">{g}</p>
              <ol className="mt-3 divide-y divide-neutral-200 border-y border-neutral-200">
                {docs.filter((d) => d.group === g).map((d) => (
                  <li key={d.slug} className="flex items-baseline gap-5 py-2.5">
                    <span className="w-6 text-sm tabular-nums text-neutral-400">{String(docs.indexOf(d) + 1).padStart(2, "0")}</span>
                    <a href={`#${d.slug}`} className="font-medium text-neutral-900">{d.title}</a>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      {docs.map((d, i) => (
        <section key={d.slug} id={d.slug} className={i < docs.length - 1 ? "break-after-page py-2" : "py-2"}>
          <p className="text-sm font-medium text-neutral-500">{d.group}</p>
          <h2 className="mt-1.5 text-[38px] font-semibold leading-tight tracking-tight text-neutral-950">{d.title}</h2>
          <p className="mt-3 max-w-2xl text-lg leading-8 text-neutral-600">{d.lead}</p>
          <div className="mt-8">
            <DocBlocks blocks={d.blocks} print />
          </div>
        </section>
      ))}
    </div>
  );
}
