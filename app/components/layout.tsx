import { BrowseLayout } from "@/components/site/browse-layout";

export default function ComponentsLayout({ children }: { children: React.ReactNode }) {
  return <BrowseLayout>{children}</BrowseLayout>;
}
