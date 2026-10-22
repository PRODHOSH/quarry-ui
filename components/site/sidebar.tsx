"use client";

import { ChevronsUpDown as QChevronsUpDown, Heart as QHeart, Images as QImages, Layers as QLayers, Loader as QLoader, Mail as QMail, MessageCircleMore as QMessageCircleMore, ShoppingBag as QShoppingBag, ShoppingCart as QShoppingCart, Smile as QSmile, Ticket as QTicket } from "lucide-react";

import { PanelRight as IPanelRight, Presentation as IPresentation, Rows3 as IRows3, BadgeCheck as IBadgeCheck } from "lucide-react";

import { BookOpen as IBookOpen, Footprints as IFootprints } from "lucide-react";

import { Map as IMap, Globe as IGlobe, Stars as IStars, Grid3x3 as IGrid3x3 } from "lucide-react";

import { Binary as IBinary, FileQuestion as IFileQuestion, Ghost as IGhost, Mountain as IMountain, SearchX as ISearchX } from "lucide-react";

import { BadgeDollarSign as IBadgeDollarSign, Bell as IBell, Building2 as IBuilding2, CaseSensitive as ICaseSensitive, CirclePlay as ICirclePlay, Clapperboard as IClapperboard, Columns3 as IColumns3, Flashlight as IFlashlight, Hash as IHash, Highlighter as IHighlighter, Images as IImages, ListOrdered as IListOrdered, ListPlus as IListPlus, Menu as IMenu, MessageSquareQuote as IMessageSquareQuote, PanelBottom as IPanelBottom, PanelsTopLeft as IPanelsTopLeft, RefreshCcw as IRefreshCcw, ScanEye as IScanEye, SearchCheck as ISearchCheck, SunMoon as ISunMoon, Terminal as ITerminal, Users as IUsers, UsersRound as IUsersRound } from "lucide-react";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Boxes,
  CalendarDays,
  ChartNoAxesColumn,
  GalleryHorizontal,
  GitBranch,
  Gift,
  LayoutGrid,
  Layers,
  ListChecks,
  LogIn,
  Megaphone,
  MessageCircleQuestion,
  MousePointerClick,
  PanelLeft,
  Plug,
  Quote,
  Route,
  Search,
  Folder,
  Activity,
  Gauge,
  Sparkles,
  Share2,
  Type,
  Cookie,
  Command,
  Timer,
  UploadCloud,
  Table2,
  MoveHorizontal,
  PanelTop,
  BadgeCheck,
  CircleDot,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type SidebarGroup = {
  id: string;
  title: string;
  items: { name: string; title: string }[];
};

/** Icons for sections and elements. Loaders are left plain on purpose: 25 similar glyphs would be noise. */
export const ICONS: Record<string, LucideIcon> = {
  "feature-bento": LayoutGrid,
  "hero-sketch": QSmile,
  "sticky-stack": QLayers,
  "event-cards": QTicket,
  "parallax-gallery": QImages,
  "product-card": QShoppingBag,
  "contact-form": QMail,
  "cart-drawer": QShoppingCart,
  "like-button": QHeart,
  "custom-select": QChevronsUpDown,
  "page-preloader": QLoader,
  "floating-chat": QMessageCircleMore,
  "hero-split": IPanelRight,
  "hero-centered": IPresentation,
  "feature-rows": IRows3,
  "cta-banner": IBadgeCheck,
  "newsletter-reader": IBookOpen,
  "sprint-roadmap": IFootprints,
  "topo-lines": IMap,
  "dot-globe": IGlobe,
  "starfield": IStars,
  "square-grid": IGrid3x3,
  "not-found-doodle": IFileQuestion,
  "not-found-poster": IGhost,
  "not-found-dots": ISearchX,
  "not-found-ascii": IBinary,
  "not-found-contour": IMountain,
  "mega-footer": IPanelBottom,
  "wordmark-footer": ICaseSensitive,
  "mega-menu-navbar": IMenu,
  "announcement-bar": IBell,
  "testimonial-columns": IColumns3,
  "testimonial-spotlight": IMessageSquareQuote,
  "faq-search": ISearchCheck,
  "spotlight-card": IFlashlight,
  "pricing-cards": IBadgeDollarSign,
  "team-cards": IUsersRound,
  "lightbox-gallery": IImages,
  "logo-cloud": IBuilding2,
  "image-reveal": IScanEye,
  "text-rotator": IRefreshCcw,
  "number-ticker": IHash,
  "text-highlighter": IHighlighter,
  "video-player": ICirclePlay,
  "video-dialog": IClapperboard,
  "feature-tabs": IPanelsTopLeft,
  "theme-toggle": ISunMoon,
  "code-tabs": ITerminal,
  "animated-list": IListPlus,
  "avatar-group": IUsers,
  "multi-step-form": IListOrdered,
  "process-steps": ListChecks,
  "scroll-timeline": Route,
  "rewards-list": Gift,
  "impact-stats": ChartNoAxesColumn,
  "tilted-feature-cards": Layers,
  "workflow-grid": GitBranch,
  "horizontal-scroll-cards": GalleryHorizontal,
  "testimonial-marquee": Quote,
  "testimonial-carousel": PanelLeft,
  "faq-accordion": MessageCircleQuestion,
  "integration-snippet": Plug,
  "call-to-action": Megaphone,
  "text-marquee": Type,
  "floating-socials": Share2,
  "scroll-reveal-pill": MousePointerClick,
  "github-heatmap": CalendarDays,
  "auth-modal": LogIn,
  "expand-gallery": GalleryHorizontal,
  "perspective-carousel": Layers,
  "image-trail": Sparkles,
  "card-stack": Boxes,
  "ai-chat": MessageCircleQuestion,
  "file-manager": Folder,
  "flow-field": Route,
  "dot-ripple": CircleDot,
  "aurora-mesh": Sparkles,
  "constellation": Share2,
  "wave-lines": Activity,
  "compass-field": MousePointerClick,
  "glow-trail": Sparkles,
  "dock": Gauge,
  "toast-stack": Layers,
  "animated-tabs": PanelTop,
  "scroll-text-reveal": Type,
  "text-scramble": Type,
  "before-after-slider": MoveHorizontal,
  "journey-timeline": Route,
  "compare-table": Table2,
  "command-menu": Command,
  "cookie-banner": Cookie,
  "countdown-timer": Timer,
  "availability-badge": BadgeCheck,
  "drop-zone": UploadCloud,
  "morphing-navbar": PanelTop,
};

export function Sidebar({ groups }: { groups: SidebarGroup[] }) {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((group) => ({
        ...group,
        items: group.items.filter((item) => item.title.toLowerCase().includes(q)),
      }))
      .filter((group) => group.items.length > 0);
  }, [groups, query]);

  return (
    <>
      {/* Mobile: a compact picker */}
      <div className="border-b px-4 py-3 font-[family-name:var(--font-general-sans)] lg:hidden">
        <select
          aria-label="Browse components"
          value={pathname.startsWith("/components/") ? pathname : "/components"}
          onChange={(e) => router.push(e.target.value)}
          className="w-full rounded-lg border bg-background px-3 py-2 text-sm"
        >
          <option value="/components">All components</option>
          {groups.map((group) => (
            <optgroup key={group.id} label={group.title}>
              {group.items.map((item) => (
                <option key={item.name} value={`/components/${item.name}`}>
                  {item.title}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      {/* Desktop: sticky navigation */}
      <aside className="font-[family-name:var(--font-general-sans)] sticky top-16 hidden h-[calc(100svh-4rem)] w-64 shrink-0 flex-col border-r lg:flex">
        <div className="px-3 pb-3 pt-4">
          <label className="relative block">
            <span className="sr-only">Search components</span>
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search components"
              className="w-full rounded-lg border bg-background py-2 pl-9 pr-3 text-sm outline-none transition-shadow placeholder:text-muted-foreground focus:border-ring focus:ring-4 focus:ring-ring/20"
            />
          </label>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 pb-8 pt-1 scrollbar-none">
          <Link
            href="/components"
            className={cn(
              "mb-6 flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              pathname === "/components"
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Boxes className="size-4 shrink-0 opacity-70" />
            All components
          </Link>

          {filtered.map((group) => (
            <div key={group.id} className="mb-7">
              <h3 className="mb-2 flex items-baseline justify-between px-3 text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground/70">
                {group.title}
                <span className="tracking-normal tabular-nums">{group.items.length}</span>
              </h3>
              <ul className="space-y-px">
                {group.items.map((item) => {
                  const active = pathname === `/components/${item.name}`;
                  const Icon = ICONS[item.name];
                  return (
                    <li key={item.name}>
                      <Link
                        href={`/components/${item.name}`}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                          active
                            ? "bg-accent text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {Icon && <Icon className="size-4 shrink-0 opacity-70" />}
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {filtered.length === 0 && (
            <p className="px-3 text-sm text-muted-foreground">No components match “{query}”.</p>
          )}
        </nav>
      </aside>
    </>
  );
}
