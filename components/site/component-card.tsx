import Link from "next/link";
import { BookmarkButton } from "@/components/auth/bookmark-button";
import { ComponentThumb } from "@/components/site/component-thumb";
import { cn } from "@/lib/utils";
import type { ThemeId } from "@/lib/themes";

/**
 * A live preview card. The link is an overlay sibling instead of a wrapper,
 * because previews can contain their own links and anchors cannot nest.
 */
export function ComponentCard({
  name,
  title,
  stage,
  theme,
  hidden = false,
  base = "/components",
  className,
}: {
  name: string;
  title: string;
  stage: "center" | "fill";
  theme?: ThemeId;
  hidden?: boolean;
  /** Route prefix the card links to. */
  base?: string;
  className?: string;
}) {
  return (
    <div className={cn("group relative", className)}>
      <div className="overflow-hidden rounded-xl border transition-all duration-300 [transition-timing-function:var(--ease-out)] group-hover:-translate-y-1 group-hover:border-foreground/30">
        <ComponentThumb name={name} stage={stage} theme={theme} />
      </div>
      <p className="mt-3 text-sm font-normal text-muted-foreground transition-colors group-hover:text-foreground">
        {title}
      </p>
      <BookmarkButton kind={base.replace("/", "") as "components"} slug={name} className="absolute right-2.5 top-2.5 z-20 size-8 opacity-0 transition-opacity focus-visible:opacity-100 group-hover:opacity-100 [&_svg]:size-3.5" />
      <Link
        href={`${base}/${name}`}
        aria-label={title}
        tabIndex={hidden ? -1 : 0}
        className="absolute inset-0 z-10 rounded-xl"
      />
    </div>
  );
}
