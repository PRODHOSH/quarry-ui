import { BrowseLayout } from "@/components/site/browse-layout";

export default function TemplatesLayout({ children }: { children: React.ReactNode }) {
  return <BrowseLayout>{children}</BrowseLayout>;
}
