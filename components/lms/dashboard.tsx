"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronRight, Flag, Plus, TrendingUp, Zap } from "lucide-react";
import { byId, KINDS, LEARNERS, PEOPLE, STATUS_LABEL, UNGRADED, type Status } from "@/lib/lms/data";
import { useBase, useLms } from "@/lib/lms/store";
import { useShell } from "@/components/lms/shell";
import { Avatar, btnGhost, KindIcon, KIND_META } from "@/components/lms/ui";
import { cn } from "@/lib/utils";

const SEG: { id: Status; color: string; dot: string }[] = [
  { id: "completed", color: "var(--chart-1)", dot: "bg-chart-1" },
  { id: "failed", color: "var(--chart-2)", dot: "bg-chart-2" },
  { id: "overdue", color: "var(--destructive)", dot: "bg-destructive" },
  { id: "in-progress", color: "var(--chart-5)", dot: "bg-chart-5" },
  { id: "not-started", color: "var(--muted)", dot: "bg-muted-foreground/40" },
];

function Card({ title, aside, children, className }: { title: string; aside?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <section className={cn("rounded-2xl border bg-card p-5", className)}>
      <div className="mb-3 flex items-center justify-between text-sm">
        <h2 className="font-bold">{title}</h2>
        {aside && <span className="text-xs font-medium text-muted-foreground">{aside}</span>}
      </div>
      {children}
    </section>
  );
}

function Gauge({ counts, total, label }: { counts: Record<Status, number>; total: number; label: number }) {
  const R = 92;
  const cx = 120;
  const cy = 118;
  const arc = (a0: number, a1: number) => {
    const p = (a: number) => [cx + R * Math.cos(Math.PI - a), cy - R * Math.sin(Math.PI - a)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${R} ${R} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  const segs = SEG.filter((x) => counts[x.id] > 0 && x.id !== "not-started").reduce<{ id: Status; color: string; from: number; to: number }[]>((list, x) => {
    const from = list.length ? list[list.length - 1].to : 0;
    return [...list, { id: x.id, color: x.color, from, to: from + (counts[x.id] / total) * Math.PI }];
  }, []);
  return (
    <div className="relative mx-auto w-full max-w-[15rem]">
      <svg viewBox="0 0 240 130" className="w-full" role="img" aria-label="Learning content by status">
        <path d={arc(0, Math.PI)} fill="none" stroke="var(--muted)" strokeWidth="22" strokeLinecap="butt" />
        {segs.map((s, i) => (
          <motion.path key={s.id} d={arc(s.from, s.to - 0.015)} fill="none" stroke={s.color} strokeWidth="22" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 * i, duration: 0.7, ease: "easeOut" }} />
        ))}
      </svg>
      <div className="absolute inset-x-0 bottom-1 text-center">
        <p className="text-xs font-medium text-muted-foreground">Learners</p>
        <p className="text-4xl font-extrabold tracking-tight">{label}</p>
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const w = 96;
  const h = 34;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const d = points.map((v, i) => `${i ? "L" : "M"}${((i / (points.length - 1)) * w).toFixed(1)},${(h - 3 - ((v - min) / (max - min || 1)) * (h - 6)).toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-9 w-24 text-chart-4" aria-hidden>
      <motion.path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
    </svg>
  );
}

export function DashboardPage() {
  const base = useBase();
  const { content, todos, toggleTodo, addTodo, graded, grade, say } = useLms();
  const { openNew } = useShell();
  const [draft, setDraft] = useState("");

  const live = content.filter((c) => !c.archived);
  const top = [...live].sort((a, b) => b.assigned.length - a.assigned.length)[0];
  const counts = useMemo(() => {
    const c: Record<Status, number> = { "not-started": 0, "in-progress": 0, completed: 0, overdue: 0, failed: 0 };
    LEARNERS.forEach((l) => Object.values(l.status).forEach((s) => c[s]++));
    return c;
  }, []);
  const totalSt = Object.values(counts).reduce((a, b) => a + b, 0);
  const submitted = counts.completed + counts.failed;
  const ranked = [...LEARNERS].sort((a, b) => b.points - a.points).slice(0, 3);
  const ungraded = UNGRADED.filter((q) => !graded.includes(q.id));

  return (
    <div className="mx-auto grid max-w-[88rem] gap-8 px-5 py-8 sm:px-8 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="min-w-0">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Good morning, Maya <span aria-hidden>👋</span></h1>

        <ul className="mt-7 flex flex-wrap gap-x-7 gap-y-3">
          {KINDS.map((k) => (
            <li key={k.id}>
              <button type="button" onClick={openNew} className="group inline-flex items-center gap-2.5 text-sm font-bold">
                <KindIcon kind={k.id} className="size-8 rounded-lg [&_svg]:size-4" />
                {k.label}
                <Plus className="size-4 text-muted-foreground transition-transform group-hover:rotate-90 group-hover:text-foreground" />
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <Card title="Most assigned content" aside="This week">
            {top && (
              <>
                <div className="flex items-end justify-between gap-3">
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-xs font-semibold"><KindIcon kind={top.kind} className="size-4 rounded [&_svg]:size-2.5" />{KIND_META[top.kind].label}</p>
                    <p className="mt-1.5 truncate text-base font-bold">{top.title}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-chart-4"><TrendingUp className="size-3.5" /> +5 since last week</p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-2xl font-extrabold leading-none">{top.assigned.length}<span className="ml-1 text-xs font-medium text-muted-foreground">people</span></p>
                    <Sparkline points={[3, 5, 4, 7, 6, 9, top.assigned.length]} />
                  </div>
                </div>
                <Link href={`${base}/content/${top.id}`} className="mt-4 flex items-center justify-between border-t pt-3 text-sm font-semibold hover:text-primary">See all assigned <ChevronRight className="size-4" /></Link>
              </>
            )}
          </Card>

          <Card title="Assignments" aside={`${totalSt - submitted} remaining`}>
            <p className="text-2xl font-extrabold">{submitted} submitted</p>
            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={Math.round((submitted / totalSt) * 100)} aria-valuemin={0} aria-valuemax={100}>
              <motion.div initial={{ width: 0 }} animate={{ width: `${(submitted / totalSt) * 100}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-primary" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{live.filter((c) => c.kind === "assignment").length || 1} assignment live</p>
            <Link href={`${base}/reports?kind=assignment`} className="mt-3 flex items-center justify-between border-t pt-3 text-sm font-semibold hover:text-primary">
              <span className="flex items-center gap-2"><KindIcon kind="assignment" className="size-6 rounded-md [&_svg]:size-3" /> See all assignments</span>
              <ChevronRight className="size-4" />
            </Link>
          </Card>
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.15fr_1fr]">
          <Card title="Learning content" aside="By status">
            <div className="grid items-center gap-5 sm:grid-cols-[1fr_1fr]">
              <Gauge counts={counts} total={totalSt} label={LEARNERS.length} />
              <ul className="space-y-1.5">
                {SEG.map((s) => (
                  <li key={s.id} className="flex items-center justify-between rounded-full bg-muted/60 px-3 py-1.5 text-xs font-semibold">
                    <span className="flex items-center gap-2"><span className={cn("size-2 rounded-full", s.dot)} />{STATUS_LABEL[s.id]}</span>
                    <span className="tabular-nums text-muted-foreground">{Math.round((counts[s.id] / totalSt) * 100)}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card title="Top learners">
            <ol className="divide-y">
              {ranked.map((l, i) => (
                <li key={l.id} className="flex items-center gap-3 py-3 first:pt-1">
                  <span className="w-5 text-xs font-bold text-muted-foreground">#{i + 1}</span>
                  <Avatar name={l.name} size={38} />
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{l.name}</span><span className="block truncate text-xs text-muted-foreground">{l.role}</span></span>
                  <span className="flex items-center gap-1.5 text-sm font-bold"><span className={cn("size-2.5 rounded-full", i === 0 ? "bg-chart-2" : i === 1 ? "bg-muted-foreground/50" : "bg-chart-3")} />{l.points}<span className="text-xs font-medium text-muted-foreground">pts</span></span>
                </li>
              ))}
            </ol>
            <Link href={`${base}/reports`} className="mt-1 inline-flex items-center gap-1 text-sm font-bold text-primary">View all <ArrowUpRight className="size-3.5" /></Link>
          </Card>
        </div>

        <Card title="Ungraded quizzes" className="mt-5 overflow-hidden p-0 [&>div:first-child]:px-5 [&>div:first-child]:pt-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead className="bg-muted/60 text-xs font-semibold text-muted-foreground">
                <tr><th className="w-12 px-5 py-2.5">#</th><th className="py-2.5">Quiz</th><th className="py-2.5">Questions</th><th className="py-2.5">Learner</th><th className="py-2.5 pr-5" /></tr>
              </thead>
              <tbody className="divide-y">
                {ungraded.map((q, i) => {
                  const p = byId(PEOPLE, q.learner)!;
                  return (
                    <tr key={q.id}>
                      <td className="px-5 py-3 text-muted-foreground">{i + 1}</td>
                      <td className="max-w-[18rem] truncate py-3 pr-4 font-semibold">{q.title}</td>
                      <td className="py-3 text-muted-foreground">{q.questions} open ended</td>
                      <td className="py-3"><span className="flex items-center gap-2"><Avatar name={p.name} size={26} />{p.name}</span></td>
                      <td className="py-3 pr-5 text-right"><button type="button" onClick={() => grade(q.id)} className={cn(btnGhost, "h-8 px-3 text-xs")}>Grade now</button></td>
                    </tr>
                  );
                })}
                {ungraded.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-muted-foreground">All caught up. Nothing to grade.</td></tr>}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <aside className="space-y-5">
        <Card title="To do">
          <form onSubmit={(e) => { e.preventDefault(); if (draft.trim()) { addTodo(draft.trim()); setDraft(""); } }} className="mb-2 flex items-center gap-2 rounded-xl border px-3 focus-within:border-primary">
            <Plus className="size-4 text-primary" />
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Add a task" aria-label="Add a task" className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
          </form>
          <ul className="max-h-[22rem] divide-y overflow-y-auto">
            {todos.map((t) => (
              <li key={t.id} className="flex gap-3 py-3">
                <button type="button" role="checkbox" aria-checked={t.done} aria-label={`Mark ${t.title} done`} onClick={() => toggleTodo(t.id)} className={cn("mt-0.5 grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors", t.done ? "border-chart-4 bg-chart-4 text-white" : "border-border hover:border-primary")}>
                  {t.done && <Check className="size-3" strokeWidth={3.5} />}
                </button>
                <div className="min-w-0">
                  <p className={cn("flex items-center gap-1.5 text-sm font-bold", t.done && "text-muted-foreground line-through")}>
                    {t.title}
                    {t.flag && <Flag className={cn("size-3.5 fill-current", t.flag === "pink" ? "text-chart-3" : "text-chart-5")} />}
                  </p>
                  {t.note && <p className="mt-0.5 text-xs text-muted-foreground">{t.note}</p>}
                  {t.due && <p className="mt-1 inline-block rounded-md bg-destructive/10 px-1.5 py-0.5 text-[11px] font-semibold text-destructive">{t.due}</p>}
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-chart-2/20 via-card to-card p-6">
          <h2 className="text-xl font-extrabold tracking-tight">Upgrade to Pro</h2>
          <p className="mt-2 text-2xl font-extrabold">$40<span className="text-sm font-medium text-muted-foreground"> / month</span></p>
          <ul className="mt-4 space-y-2 text-sm font-semibold">
            {["Unlimited courses", "Learner insights", "Advanced search", "And more"].map((f) => (
              <li key={f} className="flex items-center gap-2.5"><span className="grid size-5 place-items-center rounded-full bg-chart-4 text-white"><Check className="size-3" strokeWidth={3.5} /></span>{f}</li>
            ))}
          </ul>
          <button type="button" onClick={() => say("Upgrades are not part of this demo")} className="mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-chart-2 text-sm font-extrabold text-white transition-transform hover:opacity-90 active:scale-[0.98]"><Zap className="size-4 fill-current" /> Upgrade</button>
        </section>
      </aside>
    </div>
  );
}
