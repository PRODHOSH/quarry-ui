import type { Metadata } from "next";
import { PreviewBadge } from "./preview-badge";

export const metadata: Metadata = { robots: { index: false } };

/** Full screen live previews of the templates, away from the site chrome. */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <PreviewBadge />
    </div>
  );
}
