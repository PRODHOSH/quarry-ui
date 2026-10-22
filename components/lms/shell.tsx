"use client";

import { createContext, Suspense, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  BarChart3,
  ChevronDown,
  Clock,
  Home,
  LayoutTemplate,
  LibraryBig,
  MessageSquare,
  PanelLeftClose,
  PanelLeftOpen,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Trophy,
  Users,
  Zap,
  HelpCircle,
} from "lucide-react";
import { KINDS, ME, PROJECTS, type Kind } from "@/lib/lms/data";
import { LmsProvider, useBase, useLms } from "@/lib/lms/store";
import { Avatar, btnGhost, btnPrimary, field, KindIcon, KIND_META, Modal, Toast } from "@/components/lms/ui";
import { cn } from "@/lib/utils";

type ShellCtx = { openNew: () => void; openSearch: () => void };
const ShellContext = createContext<ShellCtx>({ openNew: () => {}, openSearch: () => {} });
export const useShell = () => useContext(ShellContext);

function Brand({ className }: { className?: string }) {
  return (
    <span className={cn("grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground", className)} aria-label="Learnly">
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 7l8-3 8 3-8 3-8-3z" />
        <path d="M7 10v4c0 1.5 2.2 3 5 3s5-1.5 5-3v-4" />
      </svg>
    </span>
  );
}

function RailLink({ href, label, icon: Icon, active }: { href: string; label: string; icon: typeof Home; active: boolean }) {
  return (
    <Link href={href} aria-label={label} title={label} aria-current={active ? "page" : undefined} className={cn("grid size-10 place-items-center rounded-xl transition-colors", active ? "bg-accent text-foreground" : "text-muted-foreground hover:bg-accent/70 hover:text-foreground")}>
      <Icon className="size-[19px]" strokeWidth={active ? 2.4 : 2} />
    </Link>
  );
}

function RailButton({ label, icon: Icon, onClick, className }: { label: string; icon: typeof Home; onClick: () => void; className?: string }) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} className={cn("grid size-10 place-items-center rounded-xl transition-colors", className ?? "text-muted-foreground hover:bg-accent/70 hover:text-foreground")}>
      <Icon className="size-[19px]" />
    </button>
  );
}

function SubRow({ href, active, icon, children, trailing }: { href: string; active?: boolean; icon: ReactNode; children: ReactNode; trailing?: ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", active ? "bg-accent font-semibold text-foreground" : "font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground")}>
      {icon}
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {trailing}
    </Link>
  );
}

function ContentSidebar() {
  const base = useBase();
  const { content, say } = useLms();
  const params = useSearchParams();
  const path = usePathname();
  const view = params.get("view");
  const project = params.get("project");
  const [fav, setFav] = useState(true);
  const favorites = content.filter((c) => c.favorite && !c.archived);
  const on = path === `${base}/content`;
  const views = [
    { id: "recent", label: "Recents", icon: Clock },
    { id: "shared", label: "Shared Content", icon: Share2 },
    { id: "archived", label: "Archived", icon: Archive },
    { id: "templates", label: "Templates", icon: LayoutTemplate },
  ];
  return (
    <>
      <nav className="space-y-0.5" aria-label="Library">
        {views.map((v) => (
          <SubRow key={v.id} href={`${base}/content?view=${v.id}`} active={on && view === v.id} icon={<v.icon className="size-4 opacity-70" />}>
            {v.label}
          </SubRow>
        ))}
      </nav>
      <div className="my-4 h-px bg-border" />
      <button type="button" onClick={() => setFav((f) => !f)} aria-expanded={fav} className="flex w-full items-center justify-between px-3 py-1 text-sm font-semibold">
        <span>Favorites <span className="ml-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">{favorites.length}</span></span>
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", !fav && "-rotate-90")} />
      </button>
      {fav && (
        <ul className="mt-1 space-y-0.5">
          {favorites.map((c) => (
            <li key={c.id}>
              <SubRow href={`${base}/content/${c.id}`} active={path === `${base}/content/${c.id}`} icon={<KindIcon kind={c.kind} className="size-5 rounded-md [&_svg]:size-3" />}>{c.title}</SubRow>
            </li>
          ))}
          {favorites.length === 0 && <li className="px-3 py-2 text-xs text-muted-foreground">Star content to pin it here.</li>}
        </ul>
      )}
      <div className="my-4 h-px bg-border" />
      <div className="flex items-center justify-between px-3 py-1 text-sm font-semibold">
        <span>Projects <span className="ml-1 rounded-md bg-muted px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground">{PROJECTS.length}</span></span>
        <button type="button" aria-label="Add project" onClick={() => say("Projects are managed from settings")} className="grid size-6 place-items-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"><Plus className="size-3.5" /></button>
      </div>
      <ul className="mt-1 space-y-0.5">
        {PROJECTS.map((p, i) => (
          <li key={p}>
            <SubRow href={`${base}/content?project=${encodeURIComponent(p)}`} active={on && project === p} icon={<span className={cn("size-2.5 rounded-sm", i ? "bg-chart-3" : "bg-primary")} />}>{p}</SubRow>
          </li>
        ))}
      </ul>
    </>
  );
}

function ReportsSidebar() {
  const base = useBase();
  const params = useSearchParams();
  const kind = params.get("kind");
  const { say } = useLms();
  return (
    <>
      <nav className="space-y-0.5" aria-label="Reports">
        <SubRow href={`${base}/reports`} active={!kind} icon={<Users className="size-4 opacity-70" />}>Learners</SubRow>
        <button type="button" onClick={() => say("Leaderboards are coming soon")} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent/60 hover:text-foreground"><Trophy className="size-4 opacity-70" /> Leaderboards</button>
      </nav>
      <div className="my-4 h-px bg-border" />
      <p className="px-3 pb-1 text-sm font-semibold">Learning content</p>
      <ul className="space-y-0.5">
        {KINDS.map((k) => (
          <li key={k.id}>
            <SubRow href={`${base}/reports?kind=${k.id}`} active={kind === k.id} icon={<KindIcon kind={k.id as Kind} className="size-5 rounded-md [&_svg]:size-3" />}>{k.label}</SubRow>
          </li>
        ))}
      </ul>
    </>
  );
}

function SubSidebar({ title, children, onClose }: { title: string; children: ReactNode; onClose: () => void }) {
  const { say } = useLms();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r bg-muted/40 lg:flex">
      <div className="flex items-center justify-between px-5 pb-3 pt-6">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Collapse panel" className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground"><PanelLeftClose className="size-4" /></button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4">{children}</div>
      <div className="m-3 rounded-2xl border bg-card p-4">
        <Sparkles className="size-5 text-primary" />
        <p className="mt-2 text-sm font-bold">Get Learnly AI</p>
        <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">Draft quizzes and summaries in every action.</p>
        <button type="button" onClick={() => say("AI tools are coming soon")} className="mt-3 rounded-full border px-3 py-1 text-xs font-semibold transition-colors hover:bg-muted">Try it now</button>
      </div>
    </aside>
  );
}

function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { content } = useLms();
  const base = useBase();
  const router = useRouter();
  const [q, setQ] = useState("");
  const hits = useMemo(() => {
    const s = q.trim().toLowerCase();
    return content.filter((c) => !s || c.title.toLowerCase().includes(s)).slice(0, 7);
  }, [content, q]);
  return (
    <Modal open={open} onClose={() => { onClose(); setQ(""); }} title="Search" width="max-w-lg">
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search courses, quizzes and pages" aria-label="Search" className={cn(field, "pl-10")} />
      </div>
      <ul className="mt-3 max-h-72 space-y-0.5 overflow-y-auto">
        {hits.map((c) => (
          <li key={c.id}>
            <button type="button" onClick={() => { router.push(`${base}/content/${c.id}`); onClose(); setQ(""); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-muted">
              <KindIcon kind={c.kind} />
              <span className="min-w-0 flex-1"><span className="block truncate text-sm font-semibold">{c.title}</span><span className="text-xs text-muted-foreground">{KIND_META[c.kind].label}</span></span>
            </button>
          </li>
        ))}
        {hits.length === 0 && <li className="px-3 py-8 text-center text-sm text-muted-foreground">Nothing matches “{q}”.</li>}
      </ul>
    </Modal>
  );
}

function NewContentModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addContent } = useLms();
  const router = useRouter();
  const base = useBase();
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<Kind>("course");
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const id = addContent(title.trim(), kind);
    setTitle("");
    onClose();
    router.push(`${base}/content/${id}`);
  };
  return (
    <Modal open={open} onClose={onClose} title="New content">
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm font-semibold">Title<input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Writing for the web" className={cn(field, "mt-1.5 font-normal")} /></label>
        <div>
          <p className="mb-2 text-sm font-semibold">Type</p>
          <div className="flex flex-wrap gap-2">
            {KINDS.map((k) => (
              <button key={k.id} type="button" onClick={() => setKind(k.id)} aria-pressed={kind === k.id} className={cn("inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors", kind === k.id ? "border-primary bg-primary/10 text-primary" : "hover:bg-muted")}>
                <KindIcon kind={k.id} className="size-5 rounded-full [&_svg]:size-3" /> {k.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <button type="button" onClick={onClose} className={btnGhost}>Cancel</button>
          <button type="submit" disabled={!title.trim()} className={cn(btnPrimary, "disabled:opacity-50")}>Create</button>
        </div>
      </form>
    </Modal>
  );
}

function Frame({ children }: { children: ReactNode }) {
  const base = useBase();
  const path = usePathname();
  const { toast, say } = useLms();
  const [panelOpen, setPanelOpen] = useState(true);
  const [search, setSearch] = useState(false);
  const [create, setCreate] = useState(false);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearch(true);
      }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, []);

  const rel = path.startsWith(base) ? path.slice(base.length) || "/" : path;
  const inContent = rel.startsWith("/content");
  const inReports = rel.startsWith("/reports");
  const hasPanel = inContent || inReports;

  return (
    <ShellContext.Provider value={{ openNew: () => setCreate(true), openSearch: () => setSearch(true) }}>
      <div className="flex h-svh flex-col bg-background font-[family-name:var(--font-manrope)] text-foreground lg:flex-row">
        <nav aria-label="Primary" className="flex shrink-0 items-center gap-1 overflow-x-auto border-b bg-card px-3 py-2 lg:w-[68px] lg:flex-col lg:overflow-visible lg:border-b-0 lg:border-r lg:px-0 lg:py-5">
          <Link href={base || "/"} aria-label="Learnly home" className="mr-2 lg:mb-4 lg:mr-0"><Brand /></Link>
          <RailLink href={base || "/"} label="Home" icon={Home} active={rel === "/"} />
          <RailButton label="Search (Ctrl K)" icon={Search} onClick={() => setSearch(true)} />
          <RailLink href={`${base}/content`} label="Learning content" icon={LibraryBig} active={inContent} />
          <RailLink href={`${base}/reports`} label="Reports" icon={BarChart3} active={inReports} />
          <div className="ml-auto flex items-center gap-1 lg:ml-0 lg:mt-auto lg:flex-col">
            <button type="button" aria-label="New content" title="New content" onClick={() => setCreate(true)} className="grid size-10 place-items-center rounded-xl bg-primary text-primary-foreground transition-transform hover:opacity-90 active:scale-95"><Plus className="size-5" /></button>
            <RailButton label="Upgrade" icon={Zap} onClick={() => say("You are on the free plan")} className="text-chart-2 hover:bg-accent/70" />
            <RailButton label="Feedback" icon={MessageSquare} onClick={() => say("Thanks, feedback noted")} />
            <RailButton label="Settings" icon={Settings} onClick={() => say("Settings are not part of this demo")} />
            <Avatar name={ME.name} size={34} className="ml-1 lg:ml-0 lg:mt-1" />
          </div>
        </nav>

        <AnimatePresence initial={false}>
          {hasPanel && panelOpen && (
            <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="hidden overflow-hidden lg:flex">
              <SubSidebar title={inContent ? "Learning Content" : "Reports"} onClose={() => setPanelOpen(false)}>
                <Suspense fallback={null}>{inContent ? <ContentSidebar /> : <ReportsSidebar />}</Suspense>
              </SubSidebar>
            </motion.div>
          )}
        </AnimatePresence>

        <main className="relative min-w-0 flex-1 overflow-y-auto">
          {hasPanel && !panelOpen && (
            <button type="button" onClick={() => setPanelOpen(true)} aria-label="Expand panel" className="absolute left-3 top-4 z-10 hidden size-8 place-items-center rounded-lg border bg-card text-muted-foreground hover:text-foreground lg:grid"><PanelLeftOpen className="size-4" /></button>
          )}
          {children}
          <button type="button" aria-label="Help" onClick={() => say("Help centre is not part of this demo")} className="fixed bottom-6 right-6 z-30 grid size-11 place-items-center rounded-full bg-foreground text-background shadow-xl transition-transform hover:scale-105"><HelpCircle className="size-5" /></button>
        </main>
      </div>
      <SearchPalette open={search} onClose={() => setSearch(false)} />
      <NewContentModal open={create} onClose={() => setCreate(false)} />
      <Toast text={toast} />
    </ShellContext.Provider>
  );
}

export function LmsShell({ children }: { children: ReactNode }) {
  return (
    <LmsProvider>
      <Frame>{children}</Frame>
    </LmsProvider>
  );
}
