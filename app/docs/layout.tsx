import { DocsNav } from "@/components/docs/nav";
import { DOC_GROUPS, getDocs } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const docs = getDocs().map(({ slug, title, group }) => ({ slug, title, group }));
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col lg:flex-row lg:gap-10">
      <DocsNav docs={docs} groups={DOC_GROUPS} pdf="/quarry-ui-documentation.pdf" />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
