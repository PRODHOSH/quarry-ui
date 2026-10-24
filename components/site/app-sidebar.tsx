"use client";

import { useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  Bot,
  ChevronLeft,
  ChevronRight,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  LayoutTemplate,
  Layers,
  Menu,
  MessageSquare,
  Newspaper,
  Rocket,
  Search,
  ShieldCheck,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { LoaderCircle, Palette, Wallpaper } from "lucide-react";
import { BrandLogo } from "@/components/design/brand-logo";
import { Bookmark } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Logo } from "@/components/site/logo";
import { CONTACT_EMAIL, SOCIAL } from "@/lib/site";
import { ICONS } from "@/components/site/sidebar";
import { cn } from "@/lib/utils";

export type SidebarGroup = { id: string; title: string; items: { name: string; title: string }[] };
export type SidebarTemplate = { name: string; title: string; tags: string[] };

type Panel = "root" | "components" | "templates" | "backgrounds" | "loaders" | "design";
type Plain = { name: string; title: string }[];
export type SidebarDesign = { slug: string; name: string; category: string };

const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Dashboard: LayoutDashboard,
  Chat: MessageSquare,
  AI: Sparkles,
  "Admin panel": ShieldCheck,
  SaaS: Layers,
  "Landing page": Rocket,
  Portfolio: User,
  Blog: Newspaper,
  Startup: BookOpen,
};
const TEMPLATE_ICONS: Record<string, LucideIcon> = { "ai-chat": Bot, "file-manager": FileText, lms: GraduationCap };

const TEMPLATE_GROUPS: { title: string; items: string[] }[] = [
  { title: "Applications", items: ["Dashboard", "Chat", "AI", "Admin panel", "SaaS"] },
  { title: "Marketing", items: ["Landing page", "Portfolio", "Blog", "Startup"] },
];

function SearchBox({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <label className="flex h-10 items-center gap-2.5 rounded-xl border bg-card px-3 text-sm text-muted-foreground transition-shadow focus-within:border-ring focus-within:ring-4 focus-within:ring-ring/15">
      <Search className="size-4 shrink-0" />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} className="w-full bg-transparent text-foreground outline-none placeholder:text-muted-foreground" />
    </label>
  );
}

function Row({ href, active, icon, children, trailing }: { href: string; active?: boolean; icon?: ReactNode; children: ReactNode; trailing?: ReactNode }) {
  return (
    <Link href={href} aria-current={active ? "page" : undefined} className={cn("flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", active ? "bg-accent font-semibold text-foreground" : "font-[450] text-muted-foreground hover:bg-accent/60 hover:text-foreground")}>
      {icon}
      <span className="flex-1 truncate">{children}</span>
      {trailing}
    </Link>
  );
}

function Heading({ children, count }: { children: ReactNode; count?: number }) {
  return (
    <h3 className="mb-1.5 mt-6 flex items-baseline justify-between px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
      {children}
      {count !== undefined && <span className="tracking-normal tabular-nums">{count}</span>}
    </h3>
  );
}

function Top({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <div className="flex items-center gap-1 px-3 pb-3 pt-4">
      <button type="button" aria-label="Back to menu" onClick={onBack} className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
        <ChevronLeft className="size-4" />
      </button>
      <p className="flex-1 text-center text-sm font-medium">{title}</p>
      <span className="size-8" />
    </div>
  );
}

/**
 * One sidebar for the whole browsing area. The first level lists the sections; choosing one slides in
 * its own level with a back arrow, the way 21st.dev does it.
 */
export function AppSidebar({ groups, templates, backgrounds, loaders, designs, children }: { groups: SidebarGroup[]; templates: SidebarTemplate[]; backgrounds: Plain; loaders: Plain; designs: SidebarDesign[]; children: ReactNode }) {
  const pathname = usePathname();
  const { user, avatar, name, openSignIn } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const section: Panel = (["templates", "components", "backgrounds", "loaders", "design"] as const).find((s) => pathname.startsWith(`/${s}`)) ?? "root";
  const [chosen, setChosen] = useState<{ panel: Panel; at: Panel } | null>(null);
  const panel = chosen && chosen.at === section ? chosen.panel : section;
  const [dir, setDir] = useState(1);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);

  const go = (p: Panel) => {
    setDir(p === "root" ? -1 : 1);
    setChosen({ panel: p, at: section });
    setQuery("");
  };

  const q = query.trim().toLowerCase();
  const total = groups.reduce((n, g) => n + g.items.length, 0);
  const cat = params.get("category");
  const tq = params.get("q") ?? "";

  const setTemplateParam = (key: string, value: string | null) => {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const qs = next.toString();
    router.replace(`/templates${qs ? `?${qs}` : ""}`, { scroll: false });
  };

  const filteredGroups = useMemo(
    () => groups.map((g) => ({ ...g, items: g.items.filter((i) => !q || i.title.toLowerCase().includes(q)) })).filter((g) => g.items.length),
    [groups, q]
  );
  const rootHits = useMemo(() => {
    if (!q) return null;
    return [
      ...groups.flatMap((g) => g.items.map((i) => ({ ...i, href: `/components/${i.name}`, kind: "Component" }))),
      ...templates.map((t) => ({ name: t.name, title: t.title, href: `/templates/${t.name}`, kind: "Template" })),
      ...backgrounds.map((b) => ({ ...b, href: `/backgrounds/${b.name}`, kind: "Background" })),
      ...loaders.map((l) => ({ ...l, href: `/loaders/${l.name}`, kind: "Loader" })),
      ...designs.map((d) => ({ name: d.slug, title: d.name, href: `/design/${d.slug}`, kind: "Design" })),
    ].filter((i) => i.title.toLowerCase().includes(q)).slice(0, 12);
  }, [groups, templates, backgrounds, loaders, designs, q]);

  const countCat = (c: string) => templates.filter((t) => t.tags.includes(c)).length;

  const levels: Partial<Record<Panel, ReactNode>> = {
    root: (
      <div className="flex h-full flex-col px-3 pb-4 pt-4">
        <SearchBox value={query} onChange={setQuery} placeholder="Search everything" />
        {rootHits ? (
          <ul className="mt-4 space-y-px">
            {rootHits.map((h) => (
              <li key={h.href}><Row href={h.href} trailing={<span className="text-[11px] text-muted-foreground/70">{h.kind}</span>}>{h.title}</Row></li>
            ))}
            {rootHits.length === 0 && <li className="px-3 py-6 text-sm text-muted-foreground">Nothing matches “{query}”.</li>}
          </ul>
        ) : (
          <>
            <nav className="mt-4 space-y-px" aria-label="Menu">
              <Row href="/" active={pathname === "/"} icon={<Home className="size-4 opacity-70" />}>Home</Row>
            </nav>
            <Heading>Explore</Heading>
            <div className="space-y-px">
              {([
                ["components", "Components", Boxes, total],
                ["templates", "Templates", LayoutTemplate, templates.length],
                ["backgrounds", "Backgrounds", Wallpaper, backgrounds.length],
                ["loaders", "Loaders", LoaderCircle, loaders.length],
                ["design", "Design systems", Palette, designs.length],
              ] as const).map(([id, label, Icon, n]) => (
                <button key={id} type="button" onClick={() => { go(id); router.push(`/${id}`); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground">
                  <Icon className="size-4 opacity-70" />
                  <span className="flex-1 text-left">{label}</span>
                  <span className="text-xs tabular-nums text-muted-foreground/70">{n}</span>
                  <ChevronRight className="size-4 opacity-60" />
                </button>
              ))}
            </div>
            <div className="mt-auto rounded-2xl border bg-card p-4">
              <p className="text-sm font-medium">Pro is coming</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Advanced components and templates, one payment.</p>
              <Link href="/waitlist" className="mt-3 inline-flex items-center gap-1 text-xs font-medium underline-offset-4 hover:underline">Join the waiting list <ArrowUpRight className="size-3" /></Link>
            </div>
          </>
        )}
      </div>
    ),

    components: (
      <div className="flex h-full flex-col">
        <Top title="Components" onBack={() => go("root")} />
        <div className="px-3"><SearchBox value={query} onChange={setQuery} placeholder="Search components" /></div>
        <nav aria-label="Components" className="mt-3 min-h-0 flex-1 overflow-y-auto px-3 pb-8 scrollbar-none">
          <Row href="/components" active={pathname === "/components"} icon={<Boxes className="size-4 opacity-70" />}>All components</Row>
          {filteredGroups.map((g) => (
            <div key={g.id}>
              <Heading count={g.items.length}>{g.title}</Heading>
              <ul className="space-y-px">
                {g.items.map((i) => {
                  const Icon = ICONS[i.name];
                  return (
                    <li key={i.name}>
                      <Row href={`/components/${i.name}`} active={pathname === `/components/${i.name}`} icon={Icon && <Icon className="size-4 shrink-0 opacity-70" />}>{i.title}</Row>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          {filteredGroups.length === 0 && <p className="px-3 pt-4 text-sm text-muted-foreground">No components match “{query}”.</p>}
        </nav>
      </div>
    ),

    templates: (
      <div className="flex h-full flex-col">
        <Top title="Templates" onBack={() => go("root")} />
        <div className="px-3">
          <SearchBox value={tq} onChange={(v) => setTemplateParam("q", v || null)} placeholder="Search templates" />
        </div>
        <nav aria-label="Templates" className="mt-3 min-h-0 flex-1 overflow-y-auto px-3 pb-8 scrollbar-none">
          <Row href="/templates" active={pathname === "/templates" && !cat} icon={<LayoutTemplate className="size-4 opacity-70" />} trailing={<span className="text-xs tabular-nums text-muted-foreground/70">{templates.length}</span>}>All Templates</Row>
          {TEMPLATE_GROUPS.map((g) => (
            <div key={g.title}>
              <Heading>{g.title}</Heading>
              <ul className="space-y-px">
                {g.items.map((c) => {
                  const n = countCat(c);
                  const active = pathname === "/templates" && cat === c;
                  const CIcon = CATEGORY_ICONS[c] ?? LayoutTemplate;
                  return (
                    <li key={c}>
                      {n ? (
                        <Row href={`/templates?category=${encodeURIComponent(c)}`} active={active} icon={<CIcon className="size-4 shrink-0 opacity-70" />} trailing={<span className="text-xs tabular-nums text-muted-foreground/70">{n}</span>}>{c}</Row>
                      ) : (
                        <span className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/40"><CIcon className="size-4 shrink-0" /><span className="flex-1">{c}</span><span className="text-xs">Soon</span></span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <Heading count={templates.length}>Templates</Heading>
          <ul className="space-y-px">
            {templates.map((t) => (
              <li key={t.name}>
                <Row href={`/templates/${t.name}`} active={pathname === `/templates/${t.name}`} icon={(() => { const TI = TEMPLATE_ICONS[t.name] ?? LayoutTemplate; return <TI className="size-4 shrink-0 opacity-70" />; })()}>{t.title}</Row>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    ),
  };

  const listPanel = (id: "backgrounds" | "loaders", title: string, items: Plain, AllIcon: LucideIcon): ReactNode => {
    const shown = items.filter((i) => !q || i.title.toLowerCase().includes(q));
    return (
      <div className="flex h-full flex-col">
        <Top title={title} onBack={() => go("root")} />
        <div className="px-3"><SearchBox value={query} onChange={setQuery} placeholder={`Search ${title.toLowerCase()}`} /></div>
        <nav aria-label={title} className="mt-3 min-h-0 flex-1 overflow-y-auto px-3 pb-8 scrollbar-none">
          <Row href={`/${id}`} active={pathname === `/${id}`} icon={<AllIcon className="size-4 opacity-70" />} trailing={<span className="text-xs tabular-nums text-muted-foreground/70">{items.length}</span>}>All {title.toLowerCase()}</Row>
          <Heading count={shown.length}>{title}</Heading>
          <ul className="space-y-px">
            {shown.map((i) => {
              const Icon = ICONS[i.name];
              return (
                <li key={i.name}>
                  <Row href={`/${id}/${i.name}`} active={pathname === `/${id}/${i.name}`} icon={Icon && <Icon className="size-4 shrink-0 opacity-70" />}>{i.title}</Row>
                </li>
              );
            })}
          </ul>
          {shown.length === 0 && <p className="px-3 pt-4 text-sm text-muted-foreground">Nothing matches “{query}”.</p>}
        </nav>
      </div>
    );
  };
  const dq = designs.filter((d) => !q || d.name.toLowerCase().includes(q));
  const dcats = Array.from(new Set(designs.map((d) => d.category)));
  levels.design = (
    <div className="flex h-full flex-col">
      <Top title="Design systems" onBack={() => go("root")} />
      <div className="px-3"><SearchBox value={query} onChange={setQuery} placeholder="Search design systems" /></div>
      <nav aria-label="Design systems" className="mt-3 min-h-0 flex-1 overflow-y-auto px-3 pb-8 scrollbar-none">
        <Row href="/design" active={pathname === "/design"} icon={<Palette className="size-4 opacity-70" />} trailing={<span className="text-xs tabular-nums text-muted-foreground/70">{designs.length}</span>}>All design systems</Row>
        {dcats.map((c) => {
          const list = dq.filter((d) => d.category === c);
          if (!list.length) return null;
          return (
            <div key={c}>
              <Heading count={list.length}>{c}</Heading>
              <ul className="space-y-px">
                {list.map((d) => (
                  <li key={d.slug}>
                    <Row href={`/design/${d.slug}`} active={pathname === `/design/${d.slug}`} icon={<BrandLogo slug={d.slug} name={d.name} className="opacity-70" />}>{d.name}</Row>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
        {dq.length === 0 && <p className="px-3 pt-4 text-sm text-muted-foreground">Nothing matches “{query}”.</p>}
      </nav>
    </div>
  );
  levels.backgrounds = listPanel("backgrounds", "Backgrounds", backgrounds, Wallpaper);
  levels.loaders = listPanel("loaders", "Loaders", loaders, LoaderCircle);

  const rail = (
    <div className="relative h-full overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false} custom={dir}>
        <motion.div
          key={panel}
          custom={dir}
          initial={{ x: dir * 40, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: dir * -40, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.32, 0.72, 0, 1] }}
          className="h-full"
        >
          {levels[panel]}
        </motion.div>
      </AnimatePresence>
    </div>
  );

  return (
    <div className="flex min-h-svh w-full flex-col lg:flex-row">
      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b bg-background/90 px-4 backdrop-blur lg:hidden">
        <Logo />
        <div className="flex items-center gap-2">
          {user ? (
            <span className="block size-9 overflow-hidden rounded-full border bg-muted">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {avatar ? <img src={avatar} alt={name ?? "You"} referrerPolicy="no-referrer" className="size-full object-cover" /> : <span className="grid size-full place-items-center text-sm font-semibold">{(name ?? "?")[0]?.toUpperCase()}</span>}
            </span>
          ) : (
            <button type="button" onClick={() => openSignIn()} className="h-9 rounded-full bg-primary px-3.5 text-sm font-medium text-primary-foreground">Sign in</button>
          )}
        <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} className="inline-flex h-9 items-center gap-2 rounded-xl border bg-card px-3.5 text-sm">
          {open ? <X className="size-4" /> : <Menu className="size-4" />} Browse
        </button>
        </div>
      </div>
      <aside className={cn("shrink-0 flex-col border-r bg-background lg:sticky lg:top-0 lg:flex lg:h-svh lg:w-64", open ? "flex h-[calc(100svh-3.5rem)]" : "hidden")}>
        <div className="hidden h-16 shrink-0 items-center px-5 lg:flex"><Logo /></div>
        <div className="min-h-0 flex-1">{rail}</div>
        <div className="flex shrink-0 items-center justify-between gap-2 border-t px-4 py-3">
          <div className="flex items-center gap-1">
            <a href={SOCIAL.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-[17px]" aria-hidden><path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" /></svg>
            </a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">Contact</a>
          </div>
          <Link href="/bookmarks" className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"><Bookmark className="size-4" /> Bookmarks</Link>
        </div>
        <div className="flex shrink-0 gap-3 px-6 pb-3 text-xs text-muted-foreground">
          <Link href="/terms" className="transition-colors hover:text-foreground">Terms</Link>
          <Link href="/privacy" className="transition-colors hover:text-foreground">Privacy</Link>
        </div>
      </aside>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
