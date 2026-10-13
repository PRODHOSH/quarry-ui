import { Suspense } from "react";
import { AppSidebar } from "@/components/site/app-sidebar";
import { getGroups } from "@/lib/registry";

/** The shell for /components and /templates: one sidebar, then the page. */
export function BrowseLayout({ children, padded = true }: { children: React.ReactNode; padded?: boolean }) {
  const all = getGroups();
  const groups = all
    .filter((g) => g.id !== "templates")
    .map((g) => ({ id: g.id, title: g.title, items: g.items.map(({ name, title }) => ({ name, title })) }));
  const templates = (all.find((g) => g.id === "templates")?.items ?? []).map((i) => ({ name: i.name, title: i.title, tags: i.meta.tags ?? [] }));

  return (
    <Suspense fallback={null}>
      <AppSidebar groups={groups} templates={templates}>
        <main className={padded ? "min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12" : "min-w-0 flex-1"}>{children}</main>
      </AppSidebar>
    </Suspense>
  );
}
