"use client";

import { useState } from "react";
import { Check, Minus, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type Mark = "yes" | "partial" | "no" | "unknown";
export type Cell = { mark: Mark; note?: string };
export type CompareRow = { label: string; subject: Cell; against: Record<string, Cell> };
export type CompareOption = { id: string; label: string };

const SCORE: Record<Mark, number | null> = { yes: 1, partial: 0.5, no: 0, unknown: null };

const DEFAULT_OPTIONS: CompareOption[] = [
  { id: "sheets", label: "Spreadsheets" },
  { id: "legacy", label: "Legacy suite" },
  { id: "inhouse", label: "Build in-house" },
];

const DEFAULT_ROWS: CompareRow[] = [
  { label: "Set up in minutes", subject: { mark: "yes", note: "Under 5 min" }, against: { sheets: { mark: "yes", note: "Blank sheet" }, legacy: { mark: "no", note: "Weeks" }, inhouse: { mark: "no", note: "Months" } } },
  { label: "Real-time collaboration", subject: { mark: "yes" }, against: { sheets: { mark: "partial", note: "Basic" }, legacy: { mark: "no" }, inhouse: { mark: "partial", note: "If you build it" } } },
  { label: "Unlimited projects", subject: { mark: "yes", note: "All plans" }, against: { sheets: { mark: "yes" }, legacy: { mark: "no", note: "Per seat" }, inhouse: { mark: "yes" } } },
  { label: "Audit log and roles", subject: { mark: "yes" }, against: { sheets: { mark: "no" }, legacy: { mark: "yes" }, inhouse: { mark: "partial", note: "Custom" } } },
  { label: "Works with your tools", subject: { mark: "yes", note: "200+ apps" }, against: { sheets: { mark: "partial", note: "Manual" }, legacy: { mark: "partial", note: "Add-ons" }, inhouse: { mark: "no", note: "You wire it" } } },
  { label: "Predictable cost", subject: { mark: "yes", note: "Flat fee" }, against: { sheets: { mark: "yes", note: "Free" }, legacy: { mark: "no", note: "Hidden fees" }, inhouse: { mark: "no", note: "Engineer time" } } },
];

const list = (items: string[]) =>
  items.length < 2 ? items.join("") : `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;

function MarkIcon({ mark }: { mark: Mark }) {
  if (mark === "yes") return <Check className="size-5 text-primary" strokeWidth={2.5} aria-label="Yes" />;
  if (mark === "no") return <X className="size-5 text-muted-foreground/70" strokeWidth={2.5} aria-label="No" />;
  if (mark === "partial") return <Minus className="size-5 text-foreground/70" strokeWidth={2.5} aria-label="Partly" />;
  return <Minus className="size-4 text-muted-foreground/40" aria-label="Not stated" />;
}

function Entry({ cell, highlight }: { cell: Cell; highlight?: boolean }) {
  return (
    <td className={cn("px-2 py-4 text-center align-middle md:px-4", highlight && "bg-accent")}>
      <div className="flex flex-col items-center gap-1">
        <MarkIcon mark={cell.mark} />
        {cell.note && <span className="max-w-full break-words text-[11px] leading-tight text-muted-foreground md:text-xs">{cell.note}</span>}
      </div>
    </td>
  );
}

/**
 * Compare one subject against switchable alternatives. A sentence above the table sums up where
 * the subject holds up and where it falls behind, using only rows where both sides are known.
 */
export function CompareTable({
  title = "How we compare",
  subjectLabel = "Northwind",
  options = DEFAULT_OPTIONS,
  rows = DEFAULT_ROWS,
  className,
}: {
  title?: string;
  subjectLabel?: string;
  options?: CompareOption[];
  rows?: CompareRow[];
  className?: string;
}) {
  const [active, setActive] = useState(options[0]?.id);
  const current = options.find((o) => o.id === active) ?? options[0];

  const pairs = rows
    .map((r) => ({ row: r, a: r.subject, b: r.against[current.id] ?? { mark: "unknown" as Mark } }))
    .filter((p) => SCORE[p.a.mark] !== null && SCORE[p.b.mark] !== null);
  const holds = pairs.filter((p) => (SCORE[p.a.mark] as number) >= (SCORE[p.b.mark] as number));
  const behind = pairs.filter((p) => (SCORE[p.a.mark] as number) < (SCORE[p.b.mark] as number));

  return (
    <section className={cn("w-full rounded-[2rem] border bg-muted/50 p-4 md:p-8", className)}>
      <div className="mb-6 flex flex-col gap-5 px-1 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-medium tracking-tight md:text-3xl">{title}</h2>
          <p className="mt-2 max-w-md text-[15px] text-muted-foreground">
            {pairs.length === 0 ? (
              "Not enough data to compare yet."
            ) : (
              <>
                Matches or beats {current.label} on <strong className="font-semibold text-foreground">{holds.length} of {pairs.length}</strong> checks
                {behind.length > 0 && <>. {current.label} is ahead on {list(behind.map((p) => p.row.label.toLowerCase()))}.</>}
              </>
            )}
          </p>
        </div>
        <div role="tablist" aria-label="Compare against" className="inline-flex max-w-full self-start overflow-x-auto rounded-full border bg-card p-1">
          {options.map((o) => (
            <button
              key={o.id}
              role="tab"
              aria-selected={o.id === current.id}
              onClick={() => setActive(o.id)}
              className={cn(
                "whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition-colors",
                o.id === current.id ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-3xl border bg-card">
        <table className="w-full table-fixed text-left">
          <caption className="sr-only">{subjectLabel} compared with {current.label}</caption>
          <thead>
            <tr className="border-b">
              <th scope="col" className="w-[44%] px-3 py-5 md:px-8"><span className="sr-only">Check</span></th>
              <th scope="col" className="bg-accent px-2 py-5 text-center text-xs font-semibold leading-tight md:px-4 md:text-base">{subjectLabel}</th>
              <th scope="col" className="px-2 py-5 text-center text-xs font-medium leading-tight text-muted-foreground md:px-4 md:text-base">{current.label}</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {rows.map((r) => (
              <tr key={r.label}>
                <th scope="row" className="px-3 py-4 text-sm font-medium md:px-8 md:text-[15px]">{r.label}</th>
                <Entry cell={r.subject} highlight />
                <Entry cell={r.against[current.id] ?? { mark: "unknown" }} />
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
