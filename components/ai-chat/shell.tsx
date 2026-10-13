"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { FolderPlus, Folder, Menu, MoreVertical, Pencil, PanelLeft, Search, SquarePen, Sparkles, Trash2, X } from "lucide-react";
import { PROJECTS } from "@/lib/ai-chat/data";
import { ChatProvider, useBase, useChats } from "@/lib/ai-chat/store";
import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-8 place-items-center rounded-full bg-primary text-primary-foreground", className)}>
      <Sparkles className="size-4" />
    </span>
  );
}

function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const s = useChats();
  const base = useBase();
  const [q, setQ] = useState("");
  const hits = useMemo(() => s.chats.filter((c) => c.title.toLowerCase().includes(q.trim().toLowerCase())).slice(0, 8), [s.chats, q]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] grid place-items-start justify-center bg-foreground/20 p-4 pt-[14vh] backdrop-blur-sm" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} className="w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-2xl">
            <label className="flex h-14 items-center gap-3 border-b px-4">
              <Search className="size-4 text-muted-foreground" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search conversations" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
            </label>
            <ul className="max-h-72 overflow-y-auto p-2">
              {hits.map((c) => (
                <li key={c.id}>
                  <Link href={`${base}/c/${c.id}`} onClick={onClose} className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm hover:bg-accent">
                    <span className="truncate">{c.title}</span>
                    <span className="ml-3 shrink-0 text-xs text-muted-foreground">{c.group}</span>
                  </Link>
                </li>
              ))}
              {hits.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">No conversations match.</li>}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ChatRow({ id, title, active }: { id: string; title: string; active: boolean }) {
  const s = useChats();
  const base = useBase();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(title);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const d = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", d);
    return () => document.removeEventListener("mousedown", d);
  }, [open]);

  if (editing)
    return (
      <form onSubmit={(e) => { e.preventDefault(); if (name.trim()) s.rename(id, name.trim()); setEditing(false); }} className="px-1">
        <input autoFocus value={name} onChange={(e) => setName(e.target.value)} onBlur={() => setEditing(false)} className="h-9 w-full rounded-lg border bg-background px-2.5 text-sm outline-none focus:ring-2 focus:ring-ring/30" />
      </form>
    );
  return (
    <div ref={root} className={cn("group relative flex items-center rounded-lg", active ? "bg-accent" : "hover:bg-accent/60")}>
      <Link href={`${base}/c/${id}`} className={cn("min-w-0 flex-1 truncate px-3 py-2 text-sm", active ? "text-foreground" : "text-muted-foreground group-hover:text-foreground")}>
        {title}
      </Link>
      <button type="button" aria-label="Chat options" aria-expanded={open} onClick={() => setOpen((o) => !o)} className={cn("mr-1 grid size-7 place-items-center rounded-md text-muted-foreground hover:text-foreground", open || active ? "opacity-100" : "opacity-0 group-hover:opacity-100")}>
        <MoreVertical className="size-4" />
      </button>
      {open && (
        <ul className="absolute right-0 top-9 z-30 w-40 rounded-xl border bg-card p-1 shadow-xl">
          <li><button type="button" onClick={() => { setOpen(false); setName(title); setEditing(true); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm hover:bg-accent"><Pencil className="size-3.5" /> Rename</button></li>
          <li><button type="button" onClick={() => { setOpen(false); s.remove(id); if (active) router.push(base || "/"); }} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"><Trash2 className="size-3.5" /> Delete</button></li>
        </ul>
      )}
    </div>
  );
}

function Sidebar({ collapsed, setCollapsed, mobileOpen, closeMobile, openSearch }: { collapsed: boolean; setCollapsed: (v: boolean) => void; mobileOpen: boolean; closeMobile: () => void; openSearch: () => void }) {
  const s = useChats();
  const base = useBase();
  const params = useParams<{ id?: string; slug?: string }>();
  const path = usePathname();
  const router = useRouter();
  const history = s.chats.filter((c) => c.group !== "Earlier");
  const groups = (["Today", "Yesterday"] as const).map((g) => [g, history.filter((c) => c.group === g)] as const).filter(([, l]) => l.length);

  const body = (
    <div className="flex h-full w-[264px] flex-col p-4">
      <div className="flex items-center justify-between pb-5">
        <Link href={base || "/"} className="flex items-center gap-2.5" onClick={closeMobile}>
          <Logo />
          <span className="text-lg font-medium tracking-tight">Converse</span>
        </Link>
        <button type="button" aria-label="Collapse sidebar" onClick={() => (mobileOpen ? closeMobile() : setCollapsed(true))} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground">
          {mobileOpen ? <X className="size-4" /> : <PanelLeft className="size-4" />}
        </button>
      </div>
      <button type="button" onClick={() => { router.push(base || "/"); closeMobile(); }} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-accent">
        <SquarePen className="size-4" /> New Chat
      </button>
      <button type="button" onClick={() => { openSearch(); closeMobile(); }} className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-foreground/80 transition-colors hover:bg-accent">
        <Search className="size-4" /> Search
      </button>

      <div className="mt-5 flex items-center justify-between px-3 pb-2">
        <p className="text-sm text-muted-foreground">Projects</p>
        <button type="button" aria-label="New project" onClick={() => s.say("Projects are created from your own backend")} className="grid size-8 place-items-center rounded-lg border text-muted-foreground hover:bg-accent hover:text-foreground"><FolderPlus className="size-4" /></button>
      </div>
      <nav aria-label="Projects" className="space-y-0.5">
        {PROJECTS.map((p) => {
          const n = s.chats.filter((c) => c.project === p.slug).length;
          const active = path.includes(`/projects/${p.slug}`) || params.slug === p.slug;
          return (
            <Link key={p.slug} href={`${base}/projects/${p.slug}`} onClick={closeMobile} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground")}>
              <Folder className="size-4" />
              <span className="flex-1">{p.name}</span>
              <span className="rounded-md bg-muted px-1.5 py-0.5 text-[11px] tabular-nums">{String(n).padStart(2, "0")}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-5 min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        {groups.map(([g, list]) => (
          <div key={g}>
            <p className="px-3 pb-1.5 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">{g}</p>
            <div className="space-y-0.5">
              {list.map((c) => (
                <ChatRow key={c.id} id={c.id} title={c.title} active={params.id === c.id} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-accent to-primary/25 p-2.5">
        <span className="grid size-10 shrink-0 place-items-center rounded-full bg-card text-xs font-semibold">AM</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">Alex Morgan</p>
          <p className="text-xs text-muted-foreground">Free</p>
        </div>
        <button type="button" className="rounded-full bg-card px-3.5 py-1.5 text-sm font-medium shadow-sm transition-colors hover:bg-background">Upgrade</button>
      </div>
    </div>
  );

  return (
    <>
      <aside className={cn("hidden shrink-0 overflow-hidden transition-[width] duration-300 lg:block", collapsed ? "w-0" : "w-[264px]")}>{body}</aside>
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={closeMobile} className="fixed inset-0 z-40 bg-foreground/30 lg:hidden" />
            <motion.aside initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }} transition={{ duration: 0.25 }} className="fixed inset-y-0 left-0 z-50 bg-muted lg:hidden">{body}</motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const s = useChats();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState(false);
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch((v) => !v); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);
  return (
    <div className="flex h-full min-h-[34rem] w-full bg-muted p-0 text-foreground lg:p-2">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} mobileOpen={mobile} closeMobile={() => setMobile(false)} openSearch={() => setSearch(true)} />
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-card lg:rounded-2xl">
        <div className="absolute left-3 top-3 z-10 flex gap-1">
          <button type="button" aria-label="Open menu" onClick={() => setMobile(true)} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground lg:hidden"><Menu className="size-[18px]" /></button>
          {collapsed && (
            <button type="button" aria-label="Expand sidebar" onClick={() => setCollapsed(false)} className="hidden size-9 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground lg:grid"><PanelLeft className="size-[18px]" /></button>
          )}
        </div>
        {children}
        <AnimatePresence>
          {s.toast && (
            <motion.p initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="absolute bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full bg-foreground px-4 py-2 text-sm text-background shadow-lg">{s.toast}</motion.p>
          )}
        </AnimatePresence>
      </div>
      <SearchModal open={search} onClose={() => setSearch(false)} />
    </div>
  );
}

/** The whole app shell. Wrap every page of the chat in this, from a layout file. */
export function ChatShell({ children }: { children: ReactNode }) {
  return (
    <ChatProvider>
      <Frame>{children}</Frame>
    </ChatProvider>
  );
}
