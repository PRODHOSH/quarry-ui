"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowUp, Bell, Check, ChevronLeft, ChevronRight, Download, Filter, Search, Trash2 } from "lucide-react";
import { LEARNERS, progressFor, STATUS_LABEL, type Learner, type Status } from "@/lib/lms/data";
import { useLms } from "@/lib/lms/store";
import { Avatar, btnGhost, btnPrimary, field, KindIcon, Ring, STATUS_DOT } from "@/components/lms/ui";
import { cn } from "@/lib/utils";

type SortKey = "name" | "points" | "progress";

function Stat({ label, value, tone }: { label: string; value: React.ReactNode; tone?: string }) {
  return (
    <div className="rounded-2xl border bg-card px-5 py-4">
      <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-extrabold tracking-tight", tone)}>{value}</p>
    </div>
  );
}

export function ReportsPage() {
  const { content, say } = useLms();
  const params = useSearchParams();
  const kind = params.get("kind");
  const available = useMemo(() => content.filter((c) => !c.archived && (!kind || c.kind === kind) && c.assigned.length > 0), [content, kind]);

  const [tab, setTab] = useState<"overview" | "progress">("progress");
  const [chosen, setChosen] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [fq, setFq] = useState("");
  const [index, setIndex] = useState(0);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "name", dir: 1 });
  const [picked, setPicked] = useState<string[]>([]);
  const [page, setPage] = useState(0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!filterOpen) return;
    const d = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setFilterOpen(false);
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [filterOpen]);

  const active = chosen.length ? available.filter((c) => chosen.includes(c.id)) : available;
  const safeIndex = Math.min(index, Math.max(0, active.length - 1));
  const current = active[safeIndex];

  const rows = useMemo(() => {
    if (!current) return [] as Learner[];
    let r = LEARNERS.filter((l) => current.assigned.includes(l.id) && l.name.toLowerCase().includes(q.toLowerCase()));
    const val = (l: Learner, k: "points" | "progress") => progressFor(l, current.id)[k];
    r = [...r].sort((a, b) => (sort.key === "name" ? a.name.localeCompare(b.name) : val(a, sort.key) - val(b, sort.key)) * sort.dir);
    return r;
  }, [current, q, sort]);

  const PAGE = 8;
  const pages = Math.max(1, Math.ceil(rows.length / PAGE));
  const shown = rows.slice(page * PAGE, page * PAGE + PAGE);

  const count = (s: Status) => rows.filter((l) => current && l.status[current.id] === s).length;
  const trained = rows.length ? Math.round((count("completed") / rows.length) * 100) : 0;

  const toggleSort = (key: SortKey) => setSort((s) => (s.key === key ? { key, dir: (s.dir * -1) as 1 | -1 } : { key, dir: 1 }));
  const allOn = shown.length > 0 && shown.every((l) => picked.includes(l.id));

  const exportCsv = () => {
    if (!current) return;
    const csv = ["Name,Role,Status,Points,Progress,Assigned by", ...rows.map((l) => [l.name, l.role, STATUS_LABEL[l.status[current.id]], progressFor(l, current.id).points, `${progressFor(l, current.id).progress}%`, l.assignedBy].join(","))].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `${current.id}-learners.csv`;
    a.click();
    URL.revokeObjectURL(url);
    say("Exported as CSV");
  };

  const sortBtn = (k: SortKey, children: React.ReactNode) => (
    <button type="button" onClick={() => toggleSort(k)} className="inline-flex items-center gap-1 font-semibold hover:text-foreground">
      {children}
      {sort.key === k && (sort.dir === 1 ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />)}
    </button>
  );

  return (
    <div className="px-5 py-6 sm:px-8 lg:pl-14">
      <header>
        <h1 className="text-2xl font-extrabold tracking-tight">Learners</h1>
        <div role="tablist" aria-label="Report view" className="mt-4 flex gap-6 border-b">
          {([["overview", "Overview"], ["progress", "Progress"]] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("relative pb-3 text-sm font-bold transition-colors", tab === k ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {l}
              {tab === k && <motion.span layoutId="lms-rtab" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-foreground" />}
            </button>
          ))}
        </div>
      </header>

      {tab === "overview" ? (
        <div className="mt-6 grid gap-4 pb-20 sm:grid-cols-2 xl:grid-cols-4">
          <Stat label="Learners" value={LEARNERS.length} />
          <Stat label="Active content" value={available.length} />
          <Stat label="Average progress" value={`${Math.round(LEARNERS.reduce((a, l) => a + l.progress, 0) / LEARNERS.length)}%`} tone="text-chart-4" />
          <Stat label="Overdue" value={LEARNERS.filter((l) => Object.values(l.status).includes("overdue")).length} tone="text-destructive" />
          <div className="rounded-2xl border bg-card p-5 sm:col-span-2 xl:col-span-4">
            <h2 className="text-sm font-bold">Content with the most learners</h2>
            <ul className="mt-4 space-y-3">
              {[...available].sort((a, b) => b.assigned.length - a.assigned.length).slice(0, 5).map((c) => (
                <li key={c.id} className="flex items-center gap-3 text-sm">
                  <KindIcon kind={c.kind} className="size-6 rounded-md [&_svg]:size-3" />
                  <span className="w-56 truncate font-semibold">{c.title}</span>
                  <span className="h-2 flex-1 overflow-hidden rounded-full bg-muted"><motion.span initial={{ width: 0 }} animate={{ width: `${(c.assigned.length / LEARNERS.length) * 100}%` }} transition={{ duration: 0.8 }} className="block h-full rounded-full bg-primary" /></span>
                  <span className="w-8 text-right font-bold tabular-nums">{c.assigned.length}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <span className="rounded-lg border px-3 py-2 text-sm font-semibold">People ({LEARNERS.length})</span>
            <div ref={ref} className="relative">
              <button type="button" aria-expanded={filterOpen} onClick={() => setFilterOpen((o) => !o)} className={cn(btnGhost, "h-10")}><Filter className="size-4" /> Add filter{chosen.length > 0 && <span className="rounded-full bg-primary px-1.5 text-[11px] text-primary-foreground">{chosen.length}</span>}</button>
              <AnimatePresence>
                {filterOpen && (
                  <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-0 top-full z-20 mt-2 w-80 rounded-2xl border bg-card p-3 shadow-2xl">
                    <div className="flex items-center justify-between px-1 pb-2"><p className="text-sm font-bold">Filters</p>{chosen.length > 0 && <button type="button" onClick={() => setChosen([])} aria-label="Clear filters" className="text-destructive"><Trash2 className="size-4" /></button>}</div>
                    <p className="px-1 pb-1.5 text-xs font-semibold text-muted-foreground">Where learning content is</p>
                    <div className="relative"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={fq} onChange={(e) => setFq(e.target.value)} placeholder="Search" aria-label="Search content" className={cn(field, "h-9 pl-9")} /></div>
                    <ul className="mt-2 max-h-56 overflow-y-auto">
                      {available.filter((c) => c.title.toLowerCase().includes(fq.toLowerCase())).map((c) => {
                        const on = chosen.includes(c.id);
                        return (
                          <li key={c.id}>
                            <button type="button" role="checkbox" aria-checked={on} onClick={() => { setChosen((s) => (on ? s.filter((x) => x !== c.id) : [...s, c.id])); setIndex(0); setPage(0); }} className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-muted">
                              <span className={cn("grid size-4 shrink-0 place-items-center rounded border-2", on ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{on && <Check className="size-2.5" strokeWidth={4} />}</span>
                              <KindIcon kind={c.kind} className="size-5 rounded-md [&_svg]:size-3" />
                              <span className="truncate text-sm font-medium">{c.title}</span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <label className="ml-auto flex items-center gap-2 rounded-lg border px-3 text-sm focus-within:border-primary"><Search className="size-4 text-muted-foreground" /><input value={q} onChange={(e) => { setQ(e.target.value); setPage(0); }} placeholder="Search learners" aria-label="Search learners" className="h-10 w-44 bg-transparent outline-none placeholder:text-muted-foreground" /></label>
            <button type="button" onClick={exportCsv} disabled={!current} className={cn(btnPrimary, "disabled:opacity-50")}><Download className="size-4" /> Export</button>
          </div>

          {current ? (
            <>
              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <div className="flex items-center gap-4 rounded-2xl border bg-card px-5 py-4"><Ring value={trained} size={52} stroke={6} /><div><p className="text-xs font-semibold text-muted-foreground">Trained</p><p className="text-2xl font-extrabold">{trained}%</p></div></div>
                <Stat label="In progress" value={count("in-progress")} />
                <Stat label="Overdue" value={count("overdue")} tone="text-destructive" />
                <Stat label="Failed" value={count("failed")} tone="text-chart-2" />
              </div>

              <div className="mt-5 overflow-hidden rounded-2xl border bg-card">
                <div className="flex items-center justify-between gap-3 border-b px-4 py-3">
                  <p className="flex min-w-0 items-center gap-2 text-sm font-bold"><KindIcon kind={current.kind} className="size-6 rounded-md [&_svg]:size-3" /><span className="truncate">{current.title}</span></p>
                  <div className="flex shrink-0 items-center gap-2 text-sm font-semibold">
                    <button type="button" aria-label="Previous content" disabled={safeIndex === 0} onClick={() => { setIndex(safeIndex - 1); setPage(0); }} className="grid size-8 place-items-center rounded-lg border disabled:opacity-40"><ChevronLeft className="size-4" /></button>
                    <span className="tabular-nums text-muted-foreground">{safeIndex + 1}/{active.length}</span>
                    <button type="button" aria-label="Next content" disabled={safeIndex >= active.length - 1} onClick={() => { setIndex(safeIndex + 1); setPage(0); }} className="grid size-8 place-items-center rounded-lg border disabled:opacity-40"><ChevronRight className="size-4" /></button>
                  </div>
                </div>

                <AnimatePresence>
                  {picked.length > 0 && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden bg-primary/10">
                      <div className="flex items-center justify-between px-4 py-2.5 text-sm font-semibold"><span>{picked.length} selected</span><span className="flex gap-2"><button type="button" onClick={() => { say(`Reminder sent to ${picked.length}`); setPicked([]); }} className="inline-flex items-center gap-1.5 text-primary"><Bell className="size-4" /> Send reminder</button><button type="button" onClick={() => setPicked([])} className="text-muted-foreground">Clear</button></span></div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[44rem] text-left text-sm">
                    <thead className="bg-muted/50 text-xs text-muted-foreground">
                      <tr>
                        <th className="w-12 px-4 py-3"><input type="checkbox" aria-label="Select all" checked={allOn} onChange={() => setPicked(allOn ? picked.filter((p) => !shown.some((l) => l.id === p)) : Array.from(new Set([...picked, ...shown.map((l) => l.id)])))} className="size-4 accent-[var(--primary)]" /></th>
                        <th className="py-3">{sortBtn("name", "Full name")}</th>
                        <th className="py-3 font-semibold">Status</th>
                        <th className="py-3">{sortBtn("points", "Points")}</th>
                        <th className="py-3">{sortBtn("progress", "Progress")}</th>
                        <th className="py-3 pr-4 font-semibold">Assigned by</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {shown.map((l) => {
                        const st = l.status[current.id];
                        return (
                          <tr key={l.id} className={cn("transition-colors hover:bg-muted/40", picked.includes(l.id) && "bg-primary/5")}>
                            <td className="px-4 py-3"><input type="checkbox" aria-label={`Select ${l.name}`} checked={picked.includes(l.id)} onChange={() => setPicked((p) => (p.includes(l.id) ? p.filter((x) => x !== l.id) : [...p, l.id]))} className="size-4 accent-[var(--primary)]" /></td>
                            <td className="py-3"><span className="flex items-center gap-3"><Avatar name={l.name} size={36} /><span><span className="flex items-center gap-2 font-bold">{l.name}<span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">{l.dept}</span></span><span className="text-xs text-muted-foreground">{l.role}</span></span></span></td>
                            <td className="py-3"><span className="flex items-center gap-2 font-medium"><span className={cn("size-2 rounded-full", STATUS_DOT[st])} />{STATUS_LABEL[st]}</span></td>
                            <td className="py-3 font-bold tabular-nums">{progressFor(l, current.id).points}<span className="ml-1 text-xs font-medium text-muted-foreground">pts</span></td>
                            <td className="py-3"><span className="flex items-center gap-2 font-semibold tabular-nums"><Ring value={progressFor(l, current.id).progress} size={22} />{progressFor(l, current.id).progress}%</span></td>
                            <td className="py-3 pr-4"><span className="flex items-center gap-2"><Avatar name={l.assignedBy} size={24} />{l.assignedBy}</span></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {shown.length === 0 && <p className="px-4 py-12 text-center text-sm text-muted-foreground">No learners match.</p>}
                </div>

                <div className="flex items-center justify-between border-t px-4 py-3 text-sm">
                  <span className="text-muted-foreground">{rows.length ? `${page * PAGE + 1}–${Math.min(rows.length, page * PAGE + PAGE)} of ${rows.length}` : "0 learners"}</span>
                  <div className="flex gap-2">
                    <button type="button" disabled={page === 0} onClick={() => setPage(page - 1)} className={cn(btnGhost, "h-8 px-3 text-xs disabled:opacity-40")}>Previous</button>
                    <button type="button" disabled={page >= pages - 1} onClick={() => setPage(page + 1)} className={cn(btnGhost, "h-8 px-3 text-xs disabled:opacity-40")}>Next</button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="mt-6 grid place-items-center rounded-2xl border border-dashed py-20 text-center"><p className="font-bold">No assigned content yet</p><p className="mt-1 text-sm text-muted-foreground">Assign something from the library to see learner progress.</p></div>
          )}
          <div className="h-20" />
        </>
      )}
    </div>
  );
}
