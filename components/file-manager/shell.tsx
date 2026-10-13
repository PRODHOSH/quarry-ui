"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, Clock, Cloud, Folder, LayoutGrid, PanelLeft, Search, Share2, Star, Trash2, Upload, UploadCloud } from "lucide-react";
import { NOTIFICATIONS, STORAGE } from "@/lib/file-manager/data";
import { FileManagerProvider, useBase, useFiles } from "@/lib/file-manager/store";
import { FileGlyph, FolderGlyph, Modal } from "@/components/file-manager/ui";
import { cn } from "@/lib/utils";

export function Initials({ name, className }: { name: string; className?: string }) {
  return <span className={cn("grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-medium", className)}>{name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>;
}

function Sidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const base = useBase();
  const path = usePathname();
  const s = useFiles();
  const nav = [
    { href: base || "/", label: "Overview", icon: LayoutGrid, exact: true },
    { href: `${base}/my-files`, label: "My Files", icon: Folder },
    { href: `${base}/shared`, label: "Shared Files", icon: Share2 },
    { href: `${base}/favorite`, label: "Favorite", icon: Star },
    { href: `${base}/recent`, label: "Recent", icon: Clock },
    { href: `${base}/trash`, label: "Trash", icon: Trash2 },
  ];
  const folders = s.folders.filter((f) => !f.trashed);
  const used = Math.round((STORAGE.usedGb / STORAGE.totalGb) * 100);

  return (
    <aside className={cn("hidden shrink-0 flex-col bg-muted p-4 transition-[width] duration-300 lg:flex", collapsed ? "w-[76px]" : "w-64")}>
      <div className="flex items-center justify-between px-1 pb-5 pt-1">
        <Link href={base || "/"} className="flex items-center gap-2.5">
          <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Cloud className="size-[18px]" /></span>
          {!collapsed && <span className="text-lg font-semibold tracking-tight">File Manager</span>}
        </Link>
        {!collapsed && (
          <button type="button" aria-label="Collapse sidebar" onClick={onToggle} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"><PanelLeft className="size-4" /></button>
        )}
      </div>
      {collapsed && (
        <button type="button" aria-label="Expand sidebar" onClick={onToggle} className="mb-3 grid size-10 place-items-center self-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"><PanelLeft className="size-4 rotate-180" /></button>
      )}

      <button type="button" className={cn("mb-4 flex items-center gap-3 rounded-xl p-2 text-left transition-colors hover:bg-accent", collapsed && "justify-center")}>
        <Initials name="Alex Morgan" />
        {!collapsed && (
          <>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium">Alex Morgan</span>
              <span className="block text-xs text-muted-foreground">Manager</span>
            </span>
            <ChevronDown className="size-4 text-muted-foreground" />
          </>
        )}
      </button>

      {!collapsed && <p className="px-3 pb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">Menu</p>}
      <nav aria-label="Main" className="space-y-0.5">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? path === href : path.startsWith(href);
          return (
            <Link key={label} href={href} aria-current={active ? "page" : undefined} title={label} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors", active ? "bg-background font-medium text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground", collapsed && "justify-center px-0")}>
              <Icon className="size-[18px] shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {!collapsed && (
        <>
          <p className="mt-6 px-3 pb-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">All Folder</p>
          <nav aria-label="Folders" className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
            {folders.map((f) => {
              const href = `${base}/folder/${f.slug}`;
              return (
                <Link key={f.slug} href={href} className={cn("flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors", path === href ? "bg-background text-foreground" : "text-muted-foreground hover:bg-accent hover:text-foreground")}>
                  <FolderGlyph tone={f.tone} className="h-4 w-5" />
                  <span className="truncate">{f.name}</span>
                </Link>
              );
            })}
          </nav>
        </>
      )}

      {!collapsed ? (
        <div className="mt-4 rounded-2xl border bg-card p-4">
          <p className="text-sm font-medium">Upgrade Storage</p>
          <div className="mt-3 flex h-4 gap-[3px]" aria-hidden>
            {Array.from({ length: 28 }).map((_, i) => (
              <span key={i} className={cn("flex-1 rounded-[2px]", i < Math.round((used / 100) * 28) ? "bg-primary" : "bg-muted")} />
            ))}
          </div>
          <p className="mt-2 flex justify-between text-xs text-muted-foreground"><span>{STORAGE.usedGb} Gb of {STORAGE.totalGb} GB Used</span><span>{used}%</span></p>
          <button type="button" className="mt-3 w-full rounded-xl bg-primary/15 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary/25">Upgrade Plan</button>
        </div>
      ) : (
        <div className="mt-auto grid place-items-center pb-1 text-xs text-muted-foreground">{used}%</div>
      )}
    </aside>
  );
}

function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useFiles();
  const base = useBase();
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return { files: s.files.filter((f) => !f.trashed).slice(0, 4), folders: s.folders.filter((f) => !f.trashed).slice(0, 3) };
    return { files: s.files.filter((f) => !f.trashed && f.name.toLowerCase().includes(t)).slice(0, 6), folders: s.folders.filter((f) => !f.trashed && f.name.toLowerCase().includes(t)).slice(0, 4) };
  }, [q, s.files, s.folders]);
  return (
    <Modal open={open} onClose={onClose} title="Search">
      <label className="flex h-11 items-center gap-2 rounded-xl border bg-background px-3 text-sm focus-within:ring-4 focus-within:ring-ring/15">
        <Search className="size-4 text-muted-foreground" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search files, folders" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
      </label>
      <div className="mt-4 max-h-72 space-y-1 overflow-y-auto">
        {results.folders.map((f) => (
          <Link key={f.slug} href={`${base}/folder/${f.slug}`} onClick={onClose} className="flex items-center gap-3 rounded-xl p-2 hover:bg-accent">
            <FolderGlyph tone={f.tone} className="h-6 w-7" />
            <span className="text-sm">{f.name}</span>
          </Link>
        ))}
        {results.files.map((f) => (
          <Link key={f.id} href={`${base}/my-files`} onClick={onClose} className="flex items-center gap-3 rounded-xl p-2 hover:bg-accent">
            <FileGlyph type={f.type} className="h-8 w-6" />
            <span className="min-w-0 flex-1 truncate text-sm">{f.name}</span>
            <span className="text-xs text-muted-foreground">{f.size}</span>
          </Link>
        ))}
        {results.files.length + results.folders.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No results for “{q}”.</p>}
      </div>
    </Modal>
  );
}

function UploadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useFiles();
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const take = (list: FileList | null) => {
    if (!list?.length) return;
    s.addFiles(Array.from(list).map((f) => ({ name: f.name, kb: Math.max(1, Math.round(f.size / 1024)) })));
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} title="Upload files">
      <div
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={(e) => { e.preventDefault(); setOver(false); take(e.dataTransfer.files); }}
        className={cn("grid place-items-center rounded-2xl border-2 border-dashed px-6 py-12 text-center transition-colors", over ? "border-primary bg-primary/10" : "border-border")}
      >
        <div>
          <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-accent"><UploadCloud className="size-5" /></span>
          <p className="mt-4 text-sm font-medium">Drag files here</p>
          <p className="mt-1 text-xs text-muted-foreground">or</p>
          <button type="button" onClick={() => input.current?.click()} className="mt-3 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">Browse files</button>
          <input ref={input} type="file" multiple hidden onChange={(e) => take(e.target.files)} />
        </div>
      </div>
    </Modal>
  );
}

function Header() {
  const [search, setSearch] = useState(false);
  const [upload, setUpload] = useState(false);
  const [bell, setBell] = useState(false);
  const [unread, setUnread] = useState(true);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch((v) => !v); }
    };
    const d = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setBell(false);
    window.addEventListener("keydown", k);
    document.addEventListener("mousedown", d);
    return () => { window.removeEventListener("keydown", k); document.removeEventListener("mousedown", d); };
  }, []);

  return (
    <header className="flex h-[76px] shrink-0 items-center gap-3 border-b px-6">
      <button type="button" onClick={() => setSearch(true)} className="flex h-12 w-full max-w-md items-center gap-3 rounded-2xl border bg-card px-4 text-sm text-muted-foreground transition-colors hover:border-primary/40">
        <Search className="size-4" />
        <span className="flex-1 text-left">Search Files, doc, image...</span>
        <kbd className="rounded-md border bg-background px-1.5 py-0.5 text-[11px]">⌘ K</kbd>
      </button>
      <div ref={root} className="relative ml-auto">
        <button type="button" aria-label="Notifications" onClick={() => { setBell((b) => !b); setUnread(false); }} className="relative grid size-12 place-items-center rounded-2xl border bg-card text-muted-foreground transition-colors hover:text-foreground">
          <Bell className="size-[18px]" />
          {unread && <span className="absolute right-3 top-3 size-2 rounded-full bg-destructive" />}
        </button>
        <AnimatePresence>
          {bell && (
            <motion.ul initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="absolute right-0 top-14 z-40 w-80 rounded-2xl border bg-card p-2 shadow-2xl">
              <li className="px-3 py-2 text-sm font-semibold">Notifications</li>
              {NOTIFICATIONS.map((n) => (
                <li key={n.id} className="rounded-xl px-3 py-2.5 text-sm hover:bg-accent">
                  <p className={cn(n.unread ? "text-foreground" : "text-muted-foreground")}>{n.text}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{n.when}</p>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
      <button type="button" onClick={() => setUpload(true)} className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.97]">
        <Upload className="size-4" /> <span className="hidden sm:inline">Upload File</span>
      </button>
      <SearchPalette open={search} onClose={() => setSearch(false)} />
      <UploadModal open={upload} onClose={() => setUpload(false)} />
    </header>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const s = useFiles();
  const [collapsed, setCollapsed] = useState(false);
  return (
    <div className="flex h-full min-h-[34rem] w-full bg-muted p-0 text-foreground lg:p-3">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-background lg:rounded-2xl">
        <Header />
        <main className="min-h-0 flex-1 overflow-y-auto p-6">{children}</main>
        <AnimatePresence>
          {s.toast && (
            <motion.p initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 14 }} role="status" className="absolute bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-5 py-2.5 text-sm text-background shadow-xl">
              {s.toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/** The whole app shell. Wrap every page of the file manager in this, from a layout file. */
export function FileManagerShell({ children }: { children: ReactNode }) {
  return (
    <FileManagerProvider>
      <Frame>{children}</Frame>
    </FileManagerProvider>
  );
}
