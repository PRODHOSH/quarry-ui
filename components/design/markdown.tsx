import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Stable id for a heading, shared with the table of contents. */
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[`*_]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");


function Chip({ hex }: { hex: string }) {
  return (
    <span className="inline-flex items-baseline gap-1.5 whitespace-nowrap">
      <span aria-hidden className="relative top-[1px] inline-block size-3 rounded-[4px] border border-foreground/15" style={{ background: hex }} />
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">{hex}</code>
    </span>
  );
}

/** Inline formatting: `code`, **bold**, *italic*, [links](url) and bare hex colours. */
function inline(text: string, key = 0): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)]+\))|(#[0-9a-fA-F]{6}\b)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let n = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const t = m[0];
    const k = `${key}-${n++}`;
    if (m[1]) {
      const code = t.slice(1, -1);
      out.push(/^#[0-9a-fA-F]{6}$/.test(code) ? <Chip key={k} hex={code} /> : <code key={k} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]">{code}</code>);
    } else if (m[2]) out.push(<strong key={k} className="font-semibold text-foreground">{inline(t.slice(2, -2), n)}</strong>);
    else if (m[3]) out.push(<em key={k}>{inline(t.slice(1, -1), n)}</em>);
    else if (m[4]) {
      const lm = t.match(/\[([^\]]+)\]\(([^)]+)\)/)!;
      out.push(<a key={k} href={lm[2]} target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-foreground">{lm[1]}</a>);
    } else out.push(<Chip key={k} hex={t} />);
    last = m.index + t.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const splitRow = (l: string) => l.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());

/**
 * A small, dependency free markdown renderer for the design files: headings, paragraphs, lists,
 * tables, code blocks and quotes. It is built for these documents, not for arbitrary markdown.
 */
export function Markdown({ source, className }: { source: string; className?: string }) {
  const lines = source.replace(/\r/g, "").split("\n");
  const out: ReactNode[] = [];
  let i = 0;
  let k = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (!line.trim()) { i++; continue; }

    const fence = line.match(/^```(\w*)/);
    if (fence) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) buf.push(lines[i++]);
      i++;
      out.push(<pre key={k++} className="my-5 overflow-x-auto rounded-xl border bg-card p-4 font-mono text-[13px] leading-relaxed"><code>{buf.join("\n")}</code></pre>);
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.*)$/);
    if (h) {
      const level = h[1].length;
      const text = h[2].replace(/\s+#+\s*$/, "");
      const id = slugify(text);
      if (level === 1) out.push(<h2 key={k++} id={id} className="mt-12 scroll-mt-24 text-2xl font-semibold tracking-tight first:mt-0">{inline(text)}</h2>);
      else if (level === 2) out.push(<h2 key={k++} id={id} className="mt-14 scroll-mt-24 border-t pt-8 text-2xl font-semibold tracking-tight first:mt-0 first:border-0 first:pt-0">{inline(text)}</h2>);
      else if (level === 3) out.push(<h3 key={k++} id={id} className="mt-8 scroll-mt-24 text-lg font-semibold tracking-tight">{inline(text)}</h3>);
      else out.push(<h4 key={k++} id={id} className="mt-6 scroll-mt-24 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{inline(text)}</h4>);
      i++;
      continue;
    }

    if (/^\s*([-*_])\s*\1\s*\1[\s\-*_]*$/.test(line)) { out.push(<hr key={k++} className="my-8" />); i++; continue; }

    if (line.startsWith(">")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) buf.push(lines[i++].replace(/^>\s?/, ""));
      out.push(<blockquote key={k++} className="my-5 rounded-xl border bg-muted/40 px-4 py-3 text-sm leading-relaxed text-muted-foreground">{inline(buf.join(" "))}</blockquote>);
      continue;
    }

    if (line.trim().startsWith("|") && i + 1 < lines.length && /^\s*\|?[\s:|-]+\|[\s:|-]*$/.test(lines[i + 1])) {
      const head = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) rows.push(splitRow(lines[i++]));
      out.push(
        <div key={k++} className="my-5 overflow-x-auto rounded-xl border">
          <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>{head.map((c, j) => <th key={j} className="px-4 py-2.5 font-medium">{inline(c)}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((r, ri) => (
                <tr key={ri} className="border-t align-top">
                  {r.map((c, j) => <td key={j} className="px-4 py-2.5 text-muted-foreground">{inline(c)}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    const li = line.match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
    if (li) {
      const ordered = /\d/.test(li[2]);
      const items: ReactNode[] = [];
      while (i < lines.length) {
        const m = lines[i].match(/^(\s*)([-*]|\d+\.)\s+(.*)$/);
        if (!m) {
          // a wrapped continuation line belongs to the previous item
          if (lines[i].trim() && /^\s{2,}\S/.test(lines[i]) && items.length) { items.push(<span key={`c${i}`}> {inline(lines[i].trim())}</span>); i++; continue; }
          break;
        }
        const depth = Math.min(2, Math.floor(m[1].length / 2));
        items.push(<li key={i} style={{ marginLeft: depth * 18 }} className="pl-1">{inline(m[3])}</li>);
        i++;
      }
      const Tag = ordered ? "ol" : "ul";
      out.push(<Tag key={k++} className={cn("my-4 space-y-2 text-[15px] leading-relaxed text-muted-foreground marker:text-muted-foreground/60", ordered ? "list-decimal pl-5" : "list-disc pl-5")}>{items}</Tag>);
      continue;
    }

    const buf: string[] = [line];
    i++;
    while (i < lines.length && lines[i].trim() && !/^(#{1,4}\s|```|>|\s*[-*]\s|\s*\d+\.\s|\|)/.test(lines[i])) buf.push(lines[i++]);
    out.push(<p key={k++} className="my-4 text-[15px] leading-relaxed text-muted-foreground">{inline(buf.join(" "))}</p>);
  }

  return <div className={className}>{out}</div>;
}

export function headingsOf(source: string) {
  const res: { id: string; text: string; level: number }[] = [];
  let fenced = false;
  for (const l of source.split("\n")) {
    if (l.startsWith("```")) fenced = !fenced;
    if (fenced) continue;
    const m = l.match(/^(#{2,3})\s+(.*)$/);
    if (m) {
      const text = m[2].replace(/[`*]/g, "").trim();
      res.push({ id: slugify(m[2]), text, level: m[1].length });
    }
  }
  return res;
}
