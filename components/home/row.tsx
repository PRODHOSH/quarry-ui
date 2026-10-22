import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

/** One shelf on the home page: a title, a short line, a "View all" link and a row that scrolls sideways. */
export function Shelf({ title, text, href, children }: { title: string; text: string; href: string; children: ReactNode }) {
  return (
    <section className="mt-14 first:mt-0">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{text}</p>
        </div>
        <Link href={href} className="group inline-flex shrink-0 items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground">
          View all <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
      <ul className="-mx-4 mt-6 flex gap-5 overflow-x-auto px-4 pb-3 scrollbar-none sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">{children}</ul>
    </section>
  );
}
