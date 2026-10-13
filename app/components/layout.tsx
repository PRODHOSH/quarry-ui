import { Sidebar } from "@/components/site/sidebar";
import { getGroups } from "@/lib/registry";

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  const groups = getGroups().map((group) => ({
    id: group.id,
    title: group.title,
    items: group.items.map(({ name, title }) => ({ name, title })),
  }));

  return (
    <div className="flex w-full flex-1 flex-col lg:flex-row">
      <Sidebar groups={groups} />
      <main className="min-w-0 flex-1 px-4 py-8 sm:px-8 lg:px-12 lg:py-12">{children}</main>
    </div>
  );
}
