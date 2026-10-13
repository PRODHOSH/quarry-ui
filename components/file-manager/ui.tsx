"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDownUp, Download, Grid2x2, List, MoreVertical, Pencil, RotateCcw, Share2, Star, Trash2, X } from "lucide-react";
import type { Category, FileItem, FolderItem } from "@/lib/file-manager/data";
import { useBase, useFiles } from "@/lib/file-manager/store";
import { cn } from "@/lib/utils";

const TONES = ["", "text-chart-1", "text-chart-2", "text-chart-3", "text-chart-4", "text-chart-5"];

export function FolderGlyph({ tone, className }: { tone: FolderItem["tone"]; className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={cn("h-9 w-11", TONES[tone], className)} aria-hidden>
      <path d="M2 8a4 4 0 0 1 4-4h11l5 5h20a4 4 0 0 1 4 4v21a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8Z" fill="currentColor" opacity="0.55" />
      <path d="M2 15a4 4 0 0 1 4-4h36a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V15Z" fill="currentColor" />
    </svg>
  );
}

const BADGE: Record<string, string> = {
  PDF: "bg-destructive text-white",
  XLS: "bg-chart-4 text-background",
  TXT: "bg-muted-foreground text-background",
  JPG: "bg-chart-1 text-background",
  JPEG: "bg-chart-1 text-background",
  PNG: "bg-chart-3 text-background",
  MP4: "bg-chart-5 text-background",
};

/** A small sheet of paper with the file type printed on it. */
export function FileGlyph({ type, className }: { type: string; className?: string }) {
  return (
    <span className={cn("relative grid h-10 w-8 place-items-center rounded-md border bg-foreground/90 text-background", className)}>
      <span className={cn("absolute -left-1.5 bottom-1.5 rounded px-1 py-px text-[8px] font-bold leading-none", BADGE[type] ?? "bg-muted-foreground text-background")}>{type}</span>
    </span>
  );
}

/** A generated cover for image files, so the grid has something to look at without shipping photos. */
export function Cover({ file }: { file: FileItem }) {
  const h = [...file.name].reduce((a, c) => a + c.charCodeAt(0), 0);
  const a = h % 360;
  return (
    <span
      className="absolute inset-0"
      style={{ background: `radial-gradient(120% 90% at ${20 + (h % 50)}% ${10 + (h % 40)}%, hsl(${a} 40% 92%), hsl(${(a + 40) % 360} 25% 70%) 55%, hsl(${(a + 90) % 360} 22% 42%))` }}
    />
  );
}

export function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-center bg-background/70 p-4 backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div role="dialog" aria-label={title} initial={{ opacity: 0, y: 12, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 12, scale: 0.97 }} transition={{ duration: 0.2 }} className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">{title}</h2>
              <button type="button" aria-label="Close" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"><X className="size-4" /></button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function Menu({ items }: { items: { label: string; icon: ReactNode; onClick: () => void; danger?: boolean }[] }) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const d = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open]);
  return (
    <div ref={root} className="relative">
      <button type="button" aria-label="More actions" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        <MoreVertical className="size-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul initial={{ opacity: 0, y: -4, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.12 }} className="absolute right-0 top-9 z-30 w-44 rounded-xl border bg-card p-1 shadow-xl">
            {items.map((i) => (
              <li key={i.label}>
                <button type="button" onClick={() => { i.onClick(); setOpen(false); }} className={cn("flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-accent", i.danger && "text-destructive")}>
                  {i.icon}
                  {i.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FolderCard({ folder, trash }: { folder: FolderItem; trash?: boolean }) {
  const base = useBase();
  const s = useFiles();
  const inner = (
    <>
      <div className="flex items-start justify-between">
        <FolderGlyph tone={folder.tone} />
        {!trash && (
          <button
            type="button"
            aria-label={folder.favorite ? "Remove from favorites" : "Add to favorites"}
            onClick={(e) => { e.preventDefault(); s.toggleFolder(folder.slug, "favorite"); }}
            className={cn("grid size-7 place-items-center rounded-lg transition-colors", folder.favorite ? "text-chart-2" : "text-transparent group-hover:text-muted-foreground hover:!text-foreground")}
          >
            <Star className={cn("size-4", folder.favorite && "fill-current")} />
          </button>
        )}
      </div>
      <p className="mt-5 truncate text-sm font-medium">{folder.name}</p>
      <p className="mt-1 text-xs text-muted-foreground">{folder.files} files • {folder.size}</p>
    </>
  );
  const cls = "group relative block rounded-2xl border bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40";
  if (trash) {
    return (
      <div className={cls}>
        {inner}
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={() => s.restoreFolder(folder.slug)} className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs hover:bg-accent"><RotateCcw className="size-3" /> Restore</button>
          <button type="button" onClick={() => s.removeFolder(folder.slug)} className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-2.5 py-1 text-xs text-destructive hover:bg-destructive/10"><Trash2 className="size-3" /> Delete</button>
        </div>
      </div>
    );
  }
  return (
    <Link href={`${base}/folder/${folder.slug}`} className={cls}>
      {inner}
    </Link>
  );
}

export function FolderGrid({ folders, trash }: { folders: FolderItem[]; trash?: boolean }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {folders.map((f) => (
        <li key={f.slug}>
          <FolderCard folder={f} trash={trash} />
        </li>
      ))}
    </ul>
  );
}

const TABS: { id: Category | "all"; label: string }[] = [
  { id: "all", label: "View All" },
  { id: "document", label: "Document" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "xls", label: "XLS" },
];

/**
 * The file area every page uses: filter tabs, sorting, a list or grid view and per file actions.
 * Pass trash to show restore and delete instead of the usual menu.
 */
export function FileSection({ title, files, defaultView = "list", trash = false, banner }: { title: string; files: FileItem[]; defaultView?: "list" | "grid"; trash?: boolean; banner?: ReactNode }) {
  const s = useFiles();
  const [tab, setTab] = useState<Category | "all">("all");
  const [view, setView] = useState(defaultView);
  const [sort, setSort] = useState<"modified" | "name" | "size">("modified");
  const [sortOpen, setSortOpen] = useState(false);
  const [picked, setPicked] = useState<string[]>([]);
  const [renaming, setRenaming] = useState<FileItem | null>(null);
  const [name, setName] = useState("");

  const list = useMemo(() => {
    const l = files.filter((f) => tab === "all" || f.category === tab);
    return [...l].sort((a, b) => (sort === "name" ? a.name.localeCompare(b.name) : sort === "size" ? b.kb - a.kb : a.age - b.age));
  }, [files, tab, sort]);

  const actions = (f: FileItem) => [
    { label: "Share", icon: <Share2 className="size-4" />, onClick: () => { s.toggleFile(f.id, "shared"); s.say(f.shared ? "Sharing turned off" : "Link copied, sharing on"); } },
    { label: f.favorite ? "Unfavorite" : "Favorite", icon: <Star className="size-4" />, onClick: () => s.toggleFile(f.id, "favorite") },
    { label: "Rename", icon: <Pencil className="size-4" />, onClick: () => { setRenaming(f); setName(f.name); } },
    { label: "Download", icon: <Download className="size-4" />, onClick: () => s.say(`Downloading ${f.name}`) },
    { label: "Delete", icon: <Trash2 className="size-4" />, onClick: () => s.trashFile(f.id), danger: true },
  ];

  const trashButtons = (f: FileItem) => (
    <span className="inline-flex gap-2">
      <button type="button" onClick={() => s.restoreFile(f.id)} className="rounded-lg border bg-card px-3 py-1.5 text-xs transition-colors hover:bg-accent">Restore</button>
      <button type="button" onClick={() => s.removeFile(f.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/40 px-3 py-1.5 text-xs text-destructive transition-colors hover:bg-destructive/10"><Trash2 className="size-3" /> Delete</button>
    </span>
  );

  return (
    <section>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {banner}
      <div className="mb-5 mt-4 flex flex-wrap items-center gap-3">
        <div role="tablist" aria-label="File type" className="flex rounded-xl border bg-card p-1">
          {TABS.map((t) => (
            <button key={t.id} role="tab" aria-selected={tab === t.id} onClick={() => setTab(t.id)} className={cn("rounded-lg px-3 py-1.5 text-sm transition-colors", tab === t.id ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>
              {t.label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-3">
          <div className="relative">
            <button type="button" aria-haspopup="menu" aria-expanded={sortOpen} onClick={() => setSortOpen((o) => !o)} className="inline-flex h-10 items-center gap-2 rounded-xl border bg-card px-3.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
              Short by <ArrowDownUp className="size-3.5" />
            </button>
            {sortOpen && (
              <ul className="absolute right-0 top-11 z-30 w-36 rounded-xl border bg-card p-1 shadow-xl">
                {([["modified", "Newest"], ["name", "Name"], ["size", "Size"]] as const).map(([k, l]) => (
                  <li key={k}>
                    <button type="button" onClick={() => { setSort(k); setSortOpen(false); }} className={cn("w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent", sort === k && "text-primary")}>{l}</button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="flex rounded-xl border bg-card p-1">
            {([["list", List, "List"], ["grid", Grid2x2, "Grid"]] as const).map(([k, I, l]) => (
              <button key={k} type="button" aria-pressed={view === k} onClick={() => setView(k)} className={cn("inline-flex h-8 items-center gap-1.5 rounded-lg px-3 text-sm transition-colors", view === k ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground")}>
                <I className="size-3.5" /> {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed py-16 text-center text-sm text-muted-foreground">Nothing here yet.</div>
      ) : view === "list" ? (
        <div className="overflow-x-auto rounded-2xl border bg-card">
          <table className="w-full min-w-[34rem] text-left text-sm">
            <thead className="border-b text-xs text-muted-foreground">
              <tr>
                <th className="w-12 py-4 pl-5">
                  <input type="checkbox" aria-label="Select all" checked={picked.length === list.length && list.length > 0} onChange={(e) => setPicked(e.target.checked ? list.map((f) => f.id) : [])} className="size-4 accent-[var(--primary)]" />
                </th>
                <th className="py-4 font-medium">Name</th>
                <th className="py-4 font-medium">Type</th>
                <th className="py-4 font-medium">Size</th>
                {!trash && <th className="py-4 font-medium">Modified</th>}
                <th className="w-12" />
              </tr>
            </thead>
            <tbody>
              {list.map((f) => (
                <tr key={f.id} className="border-b last:border-0 transition-colors hover:bg-accent/40">
                  <td className="py-3 pl-5">
                    <input type="checkbox" aria-label={`Select ${f.name}`} checked={picked.includes(f.id)} onChange={() => setPicked((p) => (p.includes(f.id) ? p.filter((x) => x !== f.id) : [...p, f.id]))} className="size-4 accent-[var(--primary)]" />
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-3.5">
                      <FileGlyph type={f.type} />
                      <div className="min-w-0">
                        <p className="truncate font-medium">{f.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{f.owner}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-muted-foreground">{f.type}</td>
                  <td className="py-3 text-muted-foreground">{f.size}</td>
                  {!trash && <td className="py-3 text-muted-foreground">{f.modified}</td>}
                  <td className="py-3 pr-4 text-right">{trash ? trashButtons(f) : <Menu items={actions(f)} />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {list.map((f) => (
            <li key={f.id} className="group">
              <div className="relative grid h-36 place-items-center overflow-hidden rounded-2xl border bg-card transition-colors group-hover:border-primary/40">
                {f.category === "image" ? <Cover file={f} /> : <FileGlyph type={f.type} className="h-14 w-11" />}
                {f.favorite && !trash && <Star className="absolute right-3 top-3 size-4 fill-chart-2 text-chart-2" />}
              </div>
              <div className="mt-3 flex items-start justify-between gap-2">
                <p className="truncate text-sm font-medium">{f.name}</p>
                {!trash && <Menu items={actions(f)} />}
              </div>
              <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                <span>{f.size}</span>
                <span>{f.modified}</span>
              </div>
              {trash && <div className="mt-2">{trashButtons(f)}</div>}
            </li>
          ))}
        </ul>
      )}

      <Modal open={!!renaming} onClose={() => setRenaming(null)} title="Rename file">
        <form onSubmit={(e) => { e.preventDefault(); if (renaming && name.trim()) { s.renameFile(renaming.id, name.trim()); setRenaming(null); s.say("Renamed"); } }} className="space-y-4">
          <input autoFocus value={name} onChange={(e) => setName(e.target.value)} className="h-11 w-full rounded-xl border bg-background px-3 text-sm outline-none focus:ring-4 focus:ring-ring/20" />
          <button type="submit" className="h-11 w-full rounded-xl bg-primary text-sm font-medium text-primary-foreground hover:opacity-90">Save</button>
        </form>
      </Modal>
    </section>
  );
}
