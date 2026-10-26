import type { ReactNode } from "react";
import { CodeBlock } from "@/components/site/code-block";
import type { Block } from "@/lib/docs";
import { cn } from "@/lib/utils";

export const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/** `code`, **bold** and [links](url) inside a line of text. */
export function Inline({ text, print = false }: { text: string; print?: boolean }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i): ReactNode => {
        if (p.startsWith("`")) return <code key={i} className={cn("rounded px-1.5 py-0.5 font-mono text-[0.86em]", print ? "bg-neutral-100 text-neutral-900" : "bg-muted text-foreground")}>{p.slice(1, -1)}</code>;
        if (p.startsWith("**")) return <strong key={i} className={cn("font-semibold", print ? "text-neutral-950" : "text-foreground")}>{p.slice(2, -2)}</strong>;
        const link = p.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) return <a key={i} href={link[2]} className="underline underline-offset-4">{link[1]}</a>;
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}

/** Renders the blocks of a doc. `print` swaps in a plain white style for the PDF. */
export function DocBlocks({ blocks, print = false }: { blocks: Block[]; print?: boolean }) {
  const ink = print ? "text-neutral-700" : "text-muted-foreground";
  const strong = print ? "text-neutral-950" : "text-foreground";
  const line = print ? "border-neutral-200" : "border-border";
  return (
    <div className="space-y-5">
      {blocks.map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i} className={cn("leading-7", ink)}><Inline text={b.text} print={print} /></p>;
          case "h3":
            return <h3 key={i} id={slugify(b.text)} className={cn("scroll-mt-24 pt-4 text-lg font-semibold tracking-tight", strong, print && "break-after-avoid")}>{b.text}</h3>;
          case "list": {
            const Tag = b.ordered ? "ol" : "ul";
            return (
              <Tag key={i} className={cn("space-y-2 pl-5 leading-7", b.ordered ? "list-decimal" : "list-disc", ink)}>
                {b.items.map((it, k) => <li key={k} className="pl-1"><Inline text={it} print={print} /></li>)}
              </Tag>
            );
          }
          case "code":
            return print ? (
              <pre key={i} className="break-inside-avoid overflow-hidden whitespace-pre-wrap rounded-lg border border-neutral-200 bg-neutral-50 p-4 font-mono text-[12px] leading-relaxed text-neutral-900">{b.code}</pre>
            ) : (
              <CodeBlock key={i} code={b.code} lang={b.lang} title={b.title} />
            );
          case "table":
            return (
              <div key={i} className={cn("overflow-x-auto rounded-xl border", line, print && "break-inside-avoid")}>
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className={cn("border-b", line, print ? "bg-neutral-50" : "bg-muted/40")}>
                      {b.head.map((h) => <th key={h} className={cn("px-4 py-2.5 font-medium", strong)}>{h}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {b.rows.map((r, k) => (
                      <tr key={k} className={cn("align-top", k < b.rows.length - 1 && cn("border-b", line))}>
                        {r.map((cell, c) => <td key={c} className={cn("px-4 py-2.5 leading-6", c === 0 ? strong : ink)}><Inline text={cell} print={print} /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          case "note":
            return (
              <aside key={i} className={cn("break-inside-avoid rounded-xl border px-4 py-3.5 text-sm leading-6", line, print ? "bg-neutral-50" : "bg-card")}>
                {b.title && <p className={cn("mb-0.5 font-medium", strong)}>{b.title}</p>}
                <p className={ink}><Inline text={b.text} print={print} /></p>
              </aside>
            );
        }
      })}
    </div>
  );
}
