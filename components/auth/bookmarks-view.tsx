"use client";

import Link from "next/link";
import { Bookmark } from "lucide-react";
import { useAuth, type BookmarkKind } from "@/components/auth/auth-provider";
import { BookmarkButton } from "@/components/auth/bookmark-button";
import { ComponentCard } from "@/components/site/component-card";
import { Skeleton } from "@/components/ui/skeleton";
import type { ThemeId } from "@/lib/themes";

type Item = { name: string; title: string; owner: BookmarkKind; stage: "center" | "fill"; theme?: ThemeId };
type Design = { slug: string; name: string; category: string; swatch: string[] };

const SECTIONS: { kind: BookmarkKind; title: string }[] = [
  { kind: "components", title: "Components" },
  { kind: "templates", title: "Templates" },
  { kind: "backgrounds", title: "Backgrounds" },
  { kind: "loaders", title: "Loaders" },
  { kind: "design", title: "Design systems" },
];

/** Everything the signed in person has saved, grouped by kind. */
export function BookmarksView({ items, designs }: { items: Item[]; designs: Design[] }) {
  const { user, loading, bookmarks, openSignIn, configured } = useAuth();

  const saved = (kind: BookmarkKind) => items.filter((i) => i.owner === kind && bookmarks.has(`${kind}:${i.name}`));
  const savedDesigns = designs.filter((d) => bookmarks.has(`design:${d.slug}`));
  const total = bookmarks.size;

  return (
    <div className="mx-auto max-w-6xl">
      <header className="mb-10">
        <h1 className="text-5xl font-medium tracking-[-0.03em]">Bookmarks</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">{user ? `${total} saved. Everything you bookmark shows up here on any device.` : "Save the things you like and find them again here."}</p>
      </header>

      {loading ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" role="status" aria-label="Loading bookmarks">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i}><Skeleton className="aspect-[16/10] w-full rounded-xl" /><Skeleton className="mt-3 h-4 w-28" /></div>
          ))}
        </div>
      ) : !user ? (
        <div className="grid place-items-center rounded-3xl border border-dashed px-6 py-20 text-center">
          <span className="grid size-12 place-items-center rounded-full border bg-card"><Bookmark className="size-5" /></span>
          <h2 className="mt-5 text-xl font-semibold tracking-tight">Sign in to see your bookmarks</h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">{configured ? "Your bookmarks are saved to your account." : "Sign in is not set up yet. Add your Supabase keys to enable it."}</p>
          <button type="button" onClick={() => openSignIn()} disabled={loading} className="mt-6 inline-flex h-11 items-center rounded-full bg-primary px-6 text-sm font-medium text-primary-foreground transition-transform active:scale-95">Sign in</button>
        </div>
      ) : total === 0 ? (
        <div className="grid place-items-center rounded-3xl border border-dashed px-6 py-20 text-center">
          <span className="grid size-12 place-items-center rounded-full border bg-card"><Bookmark className="size-5" /></span>
          <h2 className="mt-5 text-xl font-semibold tracking-tight">Nothing saved yet</h2>
          <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">Tap the bookmark on any component, template, background, loader or design system.</p>
          <Link href="/components" className="mt-6 inline-flex h-11 items-center rounded-full border px-6 text-sm font-medium transition-colors hover:bg-muted">Browse components</Link>
        </div>
      ) : (
        <div className="space-y-14">
          {SECTIONS.map(({ kind, title }) => {
            if (kind === "design") {
              if (!savedDesigns.length) return null;
              return (
                <section key={kind}>
                  <h2 className="mb-5 text-xl font-semibold tracking-tight">{title}</h2>
                  <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {savedDesigns.map((d) => (
                      <li key={d.slug} className="group relative">
                        <Link href={`/design/${d.slug}`} className="block rounded-2xl border bg-card p-3 transition-colors hover:border-foreground/30">
                          <div className="flex h-20 overflow-hidden rounded-xl border">{d.swatch.map((hex, i) => <span key={hex + i} className="h-full flex-1" style={{ background: hex }} />)}</div>
                          <p className="mt-3 px-1 text-sm font-medium">{d.name}</p>
                          <p className="px-1 text-xs text-muted-foreground">{d.category}</p>
                        </Link>
                        <BookmarkButton kind="design" slug={d.slug} className="absolute right-5 top-5 size-8 [&_svg]:size-3.5" />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            }
            const list = saved(kind);
            if (!list.length) return null;
            return (
              <section key={kind}>
                <h2 className="mb-5 text-xl font-semibold tracking-tight">{title}</h2>
                <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {list.map((i) => (
                    <li key={i.name} className="relative">
                      {kind === "templates" ? (
                        <>
                          <Link href={`/templates/${i.name}`} className="block rounded-2xl border bg-card p-5 transition-colors hover:border-foreground/30">
                            <p className="font-medium">{i.title}</p>
                            <p className="mt-1 text-xs text-muted-foreground">Full app template</p>
                          </Link>
                          <BookmarkButton kind="templates" slug={i.name} className="absolute right-4 top-4 size-8 [&_svg]:size-3.5" />
                        </>
                      ) : (
                        <ComponentCard name={i.name} title={i.title} stage={i.stage} theme={i.theme} base={`/${kind}`} />
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
