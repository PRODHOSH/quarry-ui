"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, Archive, Check, Filter, LayoutGrid, List, MoreHorizontal, Plus, Search, Star, Trash2, Upload, UserPlus, X } from "lucide-react";
import { CATEGORIES, KINDS, PEOPLE, type Content } from "@/lib/lms/data";
import { useBase, useLms } from "@/lib/lms/store";
import { useShell } from "@/components/lms/shell";
import { Art, Avatar, btnGhost, btnPrimary, field, KindIcon, Modal, Ring } from "@/components/lms/ui";
import { cn } from "@/lib/utils";

export function AssignModal({ content, open, onClose }: { content: Content; open: boolean; onClose: () => void }) {
  const { assign } = useLms();
  const [picked, setPicked] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const list = PEOPLE.filter((p) => !content.assigned.includes(p.id) && p.name.toLowerCase().includes(q.toLowerCase()));
  const close = () => { setPicked([]); setQ(""); onClose(); };
  return (
    <Modal open={open} onClose={close} title={`Assign “${content.title}”`} width="max-w-lg">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search people" aria-label="Search people" className={cn(field, "pl-10")} />
      </div>
      <ul className="mt-3 max-h-64 space-y-0.5 overflow-y-auto">
        {list.map((p) => {
          const on = picked.includes(p.id);
          return (
            <li key={p.id}>
              <button type="button" role="checkbox" aria-checked={on} onClick={() => setPicked((s) => (on ? s.filter((x) => x !== p.id) : [...s, p.id]))} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left hover:bg-muted">
                <span className={cn("grid size-5 place-items-center rounded-md border-2 transition-colors", on ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{on && <Check className="size-3" strokeWidth={3.5} />}</span>
                <Avatar name={p.name} size={32} />
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{p.name}</span><span className="text-xs text-muted-foreground">{p.role}</span></span>
              </button>
            </li>
          );
        })}
        {list.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">Everyone is already assigned.</li>}
      </ul>
      <div className="mt-4 flex justify-end gap-2">
        <button type="button" onClick={close} className={btnGhost}>Cancel</button>
        <button type="button" disabled={!picked.length} onClick={() => { assign(content.id, picked); close(); }} className={cn(btnPrimary, "disabled:opacity-50")}>Assign{picked.length ? ` (${picked.length})` : ""}</button>
      </div>
    </Modal>
  );
}

function Menu({ content, onAssign }: { content: Content; onAssign: () => void }) {
  const { toggleFavorite, patch, remove, say } = useLms();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const d = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open]);
  const item = "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium hover:bg-muted";
  return (
    <div ref={ref} className="relative">
      <button type="button" aria-label="More actions" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="grid size-8 place-items-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground"><MoreHorizontal className="size-4" /></button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="absolute bottom-full right-0 z-20 mb-2 w-48 origin-bottom-right rounded-xl border bg-card p-1 shadow-xl">
            <button type="button" className={item} onClick={() => { toggleFavorite(content.id); setOpen(false); }}><Star className={cn("size-4", content.favorite && "fill-chart-2 text-chart-2")} /> {content.favorite ? "Remove favorite" : "Add to favorites"}</button>
            <button type="button" className={item} onClick={() => { setOpen(false); onAssign(); }}><UserPlus className="size-4" /> Assign</button>
            <button type="button" className={item} onClick={() => { patch(content.id, { archived: !content.archived }); say(content.archived ? "Restored" : "Archived"); setOpen(false); }}><Archive className="size-4" /> {content.archived ? "Restore" : "Archive"}</button>
            <button type="button" className={cn(item, "text-destructive")} onClick={() => { remove(content.id); setOpen(false); }}><Trash2 className="size-4" /> Delete</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Card({ c, list }: { c: Content; list: boolean }) {
  const base = useBase();
  const [assign, setAssign] = useState(false);
  const href = `${base}/content/${c.id}`;
  return (
    <motion.li layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} className={cn("group relative overflow-hidden rounded-2xl border bg-card p-2.5 transition-shadow hover:shadow-lg", list && "flex items-center gap-4")}>
      <div className={cn("relative", list && "w-44 shrink-0")}>
        <Art variant={c.art} className={cn("rounded-xl", list ? "h-20" : "h-28")} />
        <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-md bg-foreground/85 px-2 py-0.5 text-[11px] font-semibold text-background backdrop-blur">{c.assigned.length} assigned</span>
      </div>
      <div className={cn("min-w-0 px-1.5 pb-1 pt-3", list && "flex flex-1 items-center gap-6 py-1")}>
        <div className="min-w-0 flex-1">
          <h3 className="flex items-start gap-2 text-[15px] font-bold leading-snug"><KindIcon kind={c.kind} className="mt-0.5 size-5 rounded-md [&_svg]:size-3" /><span className="line-clamp-2">{c.title}</span></h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {c.tags.map((t) => <li key={t} className="rounded-md bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">{t}</li>)}
            {!c.published && <li className="rounded-md bg-chart-2/20 px-2 py-0.5 text-[11px] font-semibold text-chart-2">Draft</li>}
          </ul>
        </div>
        <div className={cn("flex items-end justify-between gap-3", list ? "w-72 shrink-0" : "mt-4")}>
          <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span>Edited {c.edited}</span>
            {c.assigned.length > 0 && <span className="flex items-center gap-1 font-semibold text-foreground"><Ring value={c.completed} size={20} /> {c.completed}%</span>}
          </p>
          <div className="flex items-center gap-1.5">
            <button type="button" aria-label="Assign" onClick={() => setAssign(true)} className="relative z-20 grid size-8 place-items-center rounded-full border bg-card text-muted-foreground transition-colors hover:text-foreground"><UserPlus className="size-4" /></button>
            <span className="relative z-20"><Menu content={c} onAssign={() => setAssign(true)} /></span>
          </div>
        </div>
      </div>
      <Link href={href} aria-label={c.title} className="absolute inset-0 z-10 rounded-2xl" />
      <AssignModal content={c} open={assign} onClose={() => setAssign(false)} />
    </motion.li>
  );
}

export function ContentPage() {
  const { content } = useLms();
  const { openNew } = useShell();
  const { say } = useLms();
  const params = useSearchParams();
  const view = params.get("view");
  const project = params.get("project");
  const [tab, setTab] = useState<"all" | string>("all");
  const [cats, setCats] = useState<string[]>([]);
  const [filterOpen, setFilterOpen] = useState(false);
  const [q, setQ] = useState("");
  const [newest, setNewest] = useState(true);
  const [list, setList] = useState(false);

  const rows = useMemo(() => {
    let r = content.filter((c) => (view === "archived" ? c.archived : !c.archived));
    if (view === "shared") r = r.filter((c) => c.assigned.length > 4);
    if (view === "templates") r = r.filter((c) => c.kind === "path");
    if (project) r = r.filter((c) => c.project === project);
    if (tab !== "all") r = r.filter((c) => c.kind === tab);
    if (cats.length) r = r.filter((c) => cats.some((x) => c.tags.includes(x)));
    if (q.trim()) r = r.filter((c) => c.title.toLowerCase().includes(q.toLowerCase()));
    return newest ? r : [...r].reverse();
  }, [content, view, project, tab, cats, q, newest]);

  const heading = view === "archived" ? "Archived" : view === "shared" ? "Shared content" : view === "templates" ? "Templates" : view === "recent" ? "Recents" : project ?? "All content";

  return (
    <div className="px-5 py-6 sm:px-8 lg:pl-14">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-xl bg-chart-3 text-white"><LayoutGrid className="size-5" /></span>
          <h1 className="text-2xl font-extrabold tracking-tight">{heading}</h1>
          <span className="flex -space-x-2">{PEOPLE.slice(0, 3).map((p) => <Avatar key={p.id} name={p.name} size={30} className="ring-2 ring-background" />)}</span>
        </div>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => say("Uploads are not part of this demo")} className={btnGhost}><Upload className="size-4" /> Upload</button>
          <button type="button" onClick={openNew} className={btnPrimary}><Plus className="size-4" /> New content</button>
        </div>
      </header>

      <div role="tablist" aria-label="Content type" className="mt-6 flex gap-1 overflow-x-auto border-b">
        {[{ id: "all", label: "All" }, ...KINDS].map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={cn("relative whitespace-nowrap px-3.5 pb-3 pt-1 text-sm font-semibold transition-colors", tab === t.id ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
            {t.label}
            {tab === t.id && <motion.span layoutId="lms-tab" className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-foreground" />}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {cats.length > 0 && (
          <span className="inline-flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
            Category: {cats.join(", ")}
            <button type="button" aria-label="Clear category filter" onClick={() => setCats([])}><X className="size-3.5" /></button>
          </span>
        )}
        {cats.length > 0 && <button type="button" onClick={() => setCats([])} className="text-sm font-semibold text-primary">Reset</button>}
        <div className="relative">
          <button type="button" aria-expanded={filterOpen} onClick={() => setFilterOpen((o) => !o)} className="inline-flex items-center gap-2 text-sm font-semibold"><Filter className="size-4" /> Add filter</button>
          <AnimatePresence>
            {filterOpen && (
              <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute left-0 top-full z-20 mt-2 w-60 rounded-xl border bg-card p-2 shadow-xl">
                <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">Category</p>
                {CATEGORIES.map((c) => {
                  const on = cats.includes(c);
                  return (
                    <button key={c} type="button" role="checkbox" aria-checked={on} onClick={() => setCats((s) => (on ? s.filter((x) => x !== c) : [...s, c]))} className="flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left text-sm font-medium hover:bg-muted">
                      <span className={cn("grid size-4 place-items-center rounded border-2", on ? "border-primary bg-primary text-primary-foreground" : "border-border")}>{on && <Check className="size-2.5" strokeWidth={4} />}</span>
                      {c}
                    </button>
                  );
                })}
                <button type="button" onClick={() => setFilterOpen(false)} className="mt-1 w-full rounded-lg bg-muted py-1.5 text-xs font-semibold">Done</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button type="button" onClick={() => setNewest((n) => !n)} className="inline-flex items-center gap-2 text-sm font-semibold"><ArrowDownUp className="size-4" /> {newest ? "Newest first" : "Oldest first"}</button>
          <div className="flex rounded-lg bg-muted p-0.5" role="group" aria-label="Layout">
            {[{ v: false, icon: LayoutGrid, l: "Grid" }, { v: true, icon: List, l: "List" }].map((o) => (
              <button key={o.l} type="button" aria-label={o.l} aria-pressed={list === o.v} onClick={() => setList(o.v)} className={cn("grid size-8 place-items-center rounded-md transition-colors", list === o.v ? "bg-card shadow-sm" : "text-muted-foreground")}><o.icon className="size-4" /></button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-5 text-sm">
        <span className="font-bold">{rows.length} content</span>
        <label className="flex items-center gap-2 text-muted-foreground"><Search className="size-4" /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search content" className="w-40 bg-transparent outline-none placeholder:text-muted-foreground" /></label>
      </div>

      <ul className={cn("mt-5 grid gap-5 pb-24", list ? "grid-cols-1" : "sm:grid-cols-2 2xl:grid-cols-3")}>
        <AnimatePresence mode="popLayout">{rows.map((c) => <Card key={c.id} c={c} list={list} />)}</AnimatePresence>
      </ul>
      {rows.length === 0 && (
        <div className="mt-6 grid place-items-center rounded-2xl border border-dashed py-20 text-center">
          <p className="font-bold">Nothing here yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Try a different filter, or create something new.</p>
          <button type="button" onClick={openNew} className={cn(btnPrimary, "mt-5")}><Plus className="size-4" /> New content</button>
        </div>
      )}
    </div>
  );
}
