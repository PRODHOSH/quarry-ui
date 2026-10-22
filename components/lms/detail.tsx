"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Award, BarChart3, CalendarX, ChevronDown, Clock, Coins, FileText, GripVertical, Languages, Pencil, Play, Plus, Star, UserPlus, Users } from "lucide-react";
import { byId, CHART, LEARNERS, PEOPLE, STATUS_LABEL } from "@/lib/lms/data";
import { useBase, useLms } from "@/lib/lms/store";
import { AssignModal } from "@/components/lms/content";
import { Art, Avatar, btnGhost, btnPrimary, field, KindIcon, KIND_META, STATUS_DOT } from "@/components/lms/ui";
import { cn } from "@/lib/utils";

function AreaChart({ a, b }: { a: number[]; b: number[] }) {
  const W = 320;
  const H = 150;
  const max = Math.max(...a, ...b) * 1.15;
  const pts = (s: number[]) => s.map((v, i) => [(i / (s.length - 1)) * W, H - (v / max) * H] as const);
  const line = (s: number[]) => pts(s).map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H + 18}`} className="w-full overflow-visible" onMouseLeave={() => setHover(null)} role="img" aria-label="Learner activity over time">
        {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} className="stroke-border" strokeDasharray="3 4" />)}
        <path d={`${line(a)} L${W},${H} L0,${H} Z`} className="fill-chart-5/15" />
        <path d={`${line(b)} L${W},${H} L0,${H} Z`} className="fill-chart-2/15" />
        <motion.path key={a.join()} d={line(a)} fill="none" className="stroke-chart-5" strokeWidth="2" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8 }} />
        <motion.path key={b.join()} d={line(b)} fill="none" className="stroke-chart-2" strokeWidth="2" strokeLinejoin="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, delay: 0.1 }} />
        {a.map((_, i) => (
          <g key={i}>
            <rect x={(i / (a.length - 1)) * W - 22} y="0" width="44" height={H} fill="transparent" onMouseEnter={() => setHover(i)} />
            <text x={(i / (a.length - 1)) * W} y={H + 14} textAnchor={i === 0 ? "start" : i === a.length - 1 ? "end" : "middle"} className="fill-muted-foreground text-[9px]">{`Day ${i + 1}`}</text>
          </g>
        ))}
        {hover !== null && (
          <g>
            <line x1={(hover / (a.length - 1)) * W} x2={(hover / (a.length - 1)) * W} y1="0" y2={H} className="stroke-foreground/20" />
            <circle cx={pts(a)[hover][0]} cy={pts(a)[hover][1]} r="3.5" className="fill-chart-5" />
            <circle cx={pts(b)[hover][0]} cy={pts(b)[hover][1]} r="3.5" className="fill-chart-2" />
          </g>
        )}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute -top-1 rounded-lg border bg-card px-2.5 py-1.5 text-[11px] font-semibold shadow-lg" style={{ left: `${(hover / (a.length - 1)) * 100}%`, transform: "translateX(-50%)" }}>
          <p className="text-chart-5">In progress {a[hover]}</p>
          <p className="text-chart-2">Completed {b[hover]}</p>
        </div>
      )}
    </div>
  );
}

export function DetailPage({ id }: { id: string }) {
  const base = useBase();
  const s = useLms();
  const c = s.content.find((x) => x.id === id);
  const [tab, setTab] = useState<"details" | "issue" | "discussion">("details");
  const [panel, setPanel] = useState<"stats" | "assignees">("stats");
  const [range, setRange] = useState("7");
  const [more, setMore] = useState(false);
  const [open, setOpen] = useState<string[]>([c?.sections[0]?.id ?? ""]);
  const [assign, setAssign] = useState(false);
  const [editing, setEditing] = useState(false);
  const [issue, setIssue] = useState("");
  const [comment, setComment] = useState("");

  const assignees = useMemo(() => (c ? c.assigned.map((pid) => LEARNERS.find((l) => l.id === pid)).filter(Boolean) : []), [c]);

  if (!c) {
    return (
      <div className="grid min-h-[60vh] place-items-center px-6 text-center">
        <div>
          <p className="text-lg font-bold">That content no longer exists</p>
          <Link href={`${base}/content`} className={cn(btnPrimary, "mt-4")}>Back to library</Link>
        </div>
      </div>
    );
  }

  const chapters = c.sections.reduce((n, x) => n + x.chapters.length, 0);
  const trainers = c.trainers.map((t) => byId(PEOPLE, t)).filter((p): p is NonNullable<typeof p> => !!p);
  const chart = CHART[range];
  const inProg = assignees.filter((l) => l!.status[c.id] === "in-progress").length;
  const done = assignees.filter((l) => l!.status[c.id] === "completed").length;
  const total = Math.max(1, assignees.length);
  const meta = [
    [FileText, `${c.sections.length} sections and ${chapters} chapters`],
    [Coins, `${c.points} points`],
    [Clock, `${c.hours} ${c.hours === 1 ? "hour" : "hours"} estimated`],
    [Award, "Certificate of completion"],
    [CalendarX, "No due date for this content"],
  ] as const;

  return (
    <div className="mx-auto grid max-w-[84rem] gap-8 px-5 py-6 sm:px-8 lg:pl-14 xl:grid-cols-[minmax(0,1fr)_24rem]">
      <article className="min-w-0">
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Link href={`${base}/content`} className="hover:text-foreground">Content</Link> /
          <Link href={`${base}/content?project=${encodeURIComponent(c.project)}`} className="hover:text-foreground">{c.project}</Link> /
          <span className="truncate text-foreground">{c.title}</span>
        </nav>

        <div className="mt-6 flex flex-col-reverse gap-5 sm:flex-row sm:justify-between">
          <div className="min-w-0 flex-1">
            <button type="button" onClick={() => s.patch(c.id, { published: !c.published })} className={cn("inline-flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-bold", c.published ? "bg-chart-4/15 text-chart-4" : "bg-chart-2/20 text-chart-2")} title="Click to change">
              <span className="size-1.5 rounded-full bg-current" /> {c.published ? "Published" : "Draft"}
            </button>
            {editing ? (
              <input value={c.title} onChange={(e) => s.patch(c.id, { title: e.target.value })} aria-label="Title" className={cn(field, "mt-3 h-12 text-2xl font-extrabold")} />
            ) : (
              <h1 className="mt-3 text-balance text-3xl font-extrabold tracking-tight sm:text-4xl">{c.title}</h1>
            )}
            <ul className="mt-4 flex flex-wrap gap-2">{c.tags.map((t) => <li key={t} className="rounded-lg bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{t}</li>)}</ul>
            <p className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5 font-semibold text-foreground"><KindIcon kind={c.kind} className="size-6 rounded-md [&_svg]:size-3" />{KIND_META[c.kind].label}</span>
              <span className="inline-flex items-center gap-1.5"><Languages className="size-4" />{c.language}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Created by <span className="font-bold text-foreground underline underline-offset-4">{c.author}</span> on {c.created} · Edited {c.edited}</p>
          </div>
          <Art variant={c.art} className="h-36 w-full shrink-0 rounded-2xl sm:w-60" />
        </div>

        <div className="mt-7 border-t pt-6">
          {editing ? (
            <textarea value={c.description} onChange={(e) => s.patch(c.id, { description: e.target.value })} rows={4} aria-label="Description" className={cn(field, "h-auto py-3 leading-relaxed")} />
          ) : (
            <p className="max-w-3xl text-[15px] leading-relaxed">
              {more || c.description.length < 190 ? c.description : `${c.description.slice(0, 190)}… `}
              {c.description.length >= 190 && <button type="button" onClick={() => setMore((m) => !m)} className="font-bold text-primary">{more ? " Show less" : "Read more"}</button>}
            </p>
          )}
        </div>

        <div role="tablist" aria-label="Content sections" className="mt-8 flex gap-6 border-b">
          {([["details", "Details"], ["issue", "Report issue"], ["discussion", "Discussion"]] as const).map(([k, l]) => (
            <button key={k} role="tab" aria-selected={tab === k} onClick={() => setTab(k)} className={cn("relative pb-3 text-sm font-bold transition-colors", tab === k ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {l}{k === "discussion" && <span className="ml-1.5 rounded-md bg-muted px-1.5 text-[11px]">{(s.comments[c.id] ?? []).length}</span>}
              {tab === k && <motion.span layoutId="lms-dtab" className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-foreground" />}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }} className="pt-6">
            {tab === "details" && (
              <>
                <ul className="grid gap-3 text-sm font-medium sm:grid-cols-2">
                  {meta.map(([Icon, text]) => <li key={text} className="flex items-center gap-3"><Icon className="size-[18px] text-muted-foreground" />{text}</li>)}
                </ul>

                <div className="mt-10 flex items-center justify-between">
                  <h2 className="text-lg font-extrabold">Trainers</h2>
                  <button type="button" onClick={() => s.addTrainer(c.id)} className={btnGhost}><Plus className="size-4" /> Add trainer</button>
                </div>
                <ul className="mt-4 grid gap-5 sm:grid-cols-2">
                  {trainers.map((t) => (
                    <li key={t.id} className="flex gap-3">
                      <Avatar name={t.name} size={48} />
                      <div><p className="font-bold">{t.name}</p><p className="text-sm text-muted-foreground">{t.role}</p><span className="mt-1.5 inline-block rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">Author · {t.dept}</span></div>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex items-center justify-between">
                  <div><h2 className="text-lg font-extrabold">Content</h2><p className="text-sm text-muted-foreground">{c.sections.length} sections · {chapters} chapters</p></div>
                  <button type="button" onClick={() => s.addSection(c.id)} className={btnGhost}><Plus className="size-4" /> Add section</button>
                </div>
                <ul className="mt-4 space-y-3 pb-20">
                  {c.sections.map((sec) => {
                    const on = open.includes(sec.id);
                    return (
                      <li key={sec.id} className="overflow-hidden rounded-xl border bg-card">
                        <button type="button" aria-expanded={on} onClick={() => setOpen((o) => (on ? o.filter((x) => x !== sec.id) : [...o, sec.id]))} className="flex w-full items-center gap-3 bg-muted/50 px-4 py-3.5 text-left">
                          <GripVertical className="size-4 text-muted-foreground/60" />
                          <span className="flex-1 text-sm font-bold">{sec.title}</span>
                          <span className="text-xs font-semibold text-muted-foreground">{sec.chapters.length} {sec.chapters.length === 1 ? "chapter" : "chapters"}</span>
                          <ChevronDown className={cn("size-4 transition-transform", on && "rotate-180")} />
                        </button>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                              <ul className="divide-y px-4">
                                {sec.chapters.map((ch) => <li key={ch.id} className="flex items-center gap-3 py-3 text-sm font-medium"><FileText className="size-4 text-muted-foreground" />{ch.title}</li>)}
                              </ul>
                              <button type="button" onClick={() => s.addChapter(c.id, sec.id)} className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-primary"><Plus className="size-4" /> Add chapter</button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {tab === "issue" && (
              <form onSubmit={(e) => { e.preventDefault(); if (issue.trim()) { setIssue(""); s.say("Thanks, we will take a look"); } }} className="max-w-xl">
                <label className="block text-sm font-bold">What is not right?<textarea value={issue} onChange={(e) => setIssue(e.target.value)} rows={5} placeholder="Describe the problem so the author can fix it" className={cn(field, "mt-2 h-auto py-3 font-normal")} /></label>
                <button type="submit" disabled={!issue.trim()} className={cn(btnPrimary, "mt-4 disabled:opacity-50")}>Send report</button>
              </form>
            )}

            {tab === "discussion" && (
              <div className="max-w-2xl pb-20">
                <ul className="space-y-5">
                  {(s.comments[c.id] ?? []).map((m) => (
                    <li key={m.id} className="flex gap-3"><Avatar name={m.author} size={36} /><div className="rounded-2xl rounded-tl-sm bg-muted/60 px-4 py-3"><p className="text-sm font-bold">{m.author} <span className="font-medium text-muted-foreground">· {m.at}</span></p><p className="mt-1 text-sm leading-relaxed">{m.text}</p></div></li>
                  ))}
                  {(s.comments[c.id] ?? []).length === 0 && <li className="text-sm text-muted-foreground">No comments yet. Start the conversation.</li>}
                </ul>
                <form onSubmit={(e) => { e.preventDefault(); if (comment.trim()) { s.addComment(c.id, comment.trim()); setComment(""); } }} className="mt-6 flex gap-2">
                  <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment" aria-label="Write a comment" className={field} />
                  <button type="submit" disabled={!comment.trim()} className={cn(btnPrimary, "disabled:opacity-50")}>Post</button>
                </form>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </article>

      <aside className="self-start xl:sticky xl:top-6">
        <div className="overflow-hidden rounded-2xl border bg-card">
          <div role="tablist" aria-label="Panel" className="grid grid-cols-2 border-b">
            {([["stats", "Statistics", BarChart3], ["assignees", "Assignees", Users]] as const).map(([k, l, Icon]) => (
              <button key={k} role="tab" aria-selected={panel === k} onClick={() => setPanel(k)} className={cn("relative flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors", panel === k ? "text-foreground" : "text-muted-foreground")}>
                <Icon className="size-4" /> {l}
                {panel === k && <motion.span layoutId="lms-ptab" className="absolute inset-x-0 -bottom-px h-0.5 bg-foreground" />}
              </button>
            ))}
          </div>

          {panel === "stats" ? (
            <div className="p-5">
              <label className="flex items-center gap-2 text-sm text-muted-foreground">Show data in
                <select value={range} onChange={(e) => setRange(e.target.value)} className="rounded-md bg-transparent font-bold text-foreground outline-none">{Object.entries(CHART).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
              </label>
              <div className="mt-5"><AreaChart a={chart.inProgress} b={chart.completed} /></div>
              <dl className="mt-5 grid grid-cols-2 gap-4 text-xs">
                <div><dt className="flex items-center gap-1.5 font-semibold text-muted-foreground"><span className="size-2 rounded-sm bg-chart-5" />In progress</dt><dd className="mt-1 text-sm font-bold">{inProg} · {Math.round((inProg / total) * 100)}%</dd></div>
                <div><dt className="flex items-center gap-1.5 font-semibold text-muted-foreground"><span className="size-2 rounded-sm bg-chart-2" />Completed</dt><dd className="mt-1 text-sm font-bold">{done} · {Math.round((done / total) * 100)}%</dd></div>
              </dl>
            </div>
          ) : (
            <ul className="max-h-[22rem] divide-y overflow-y-auto px-5">
              {assignees.map((l) => (
                <li key={l!.id} className="flex items-center gap-3 py-3">
                  <Avatar name={l!.name} size={34} />
                  <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold">{l!.name}</span><span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className={cn("size-1.5 rounded-full", STATUS_DOT[l!.status[c.id]])} />{STATUS_LABEL[l!.status[c.id]]}</span></span>
                </li>
              ))}
              {assignees.length === 0 && <li className="py-10 text-center text-sm text-muted-foreground">Nobody is assigned yet.</li>}
            </ul>
          )}

          <div className="border-t p-4">
            <div className="flex gap-2">
              <button type="button" onClick={() => setAssign(true)} className={cn(btnPrimary, "h-11 flex-1")}><UserPlus className="size-4" /> Assign</button>
              <button type="button" aria-label={c.favorite ? "Remove favorite" : "Favorite"} onClick={() => s.toggleFavorite(c.id)} className={cn(btnGhost, "h-11 w-11 px-0")}><Star className={cn("size-4", c.favorite && "fill-chart-2 text-chart-2")} /></button>
            </div>
            <div className="mt-3 grid grid-cols-2 divide-x text-sm font-bold">
              <button type="button" onClick={() => s.say("Preview opens the learner view")} className="flex items-center justify-center gap-2 py-1.5 hover:text-primary"><Play className="size-4" /> Preview</button>
              <button type="button" onClick={() => setEditing((e) => !e)} className="flex items-center justify-center gap-2 py-1.5 hover:text-primary"><Pencil className="size-4" /> {editing ? "Done" : "Edit"}</button>
            </div>
          </div>
        </div>
      </aside>
      <AssignModal content={c} open={assign} onClose={() => setAssign(false)} />
    </div>
  );
}
