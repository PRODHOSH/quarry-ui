import Link from "next/link";
import { ArrowUpRight, Boxes, LayoutTemplate, Palette, Wallpaper } from "lucide-react";
import { NotFoundDoodle } from "@/registry/quarry/not-found-doodle";

const LINKS = [
  { href: "/components", label: "Components", icon: Boxes },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/backgrounds", label: "Backgrounds", icon: Wallpaper },
  { href: "/design", label: "Design systems", icon: Palette },
];

export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl">
      <NotFoundDoodle title="This page wandered off" message="The link may be old, or the page may have moved. Here are a few good places to pick up from." homeLabel="Back home" />
      <ul className="mx-auto grid max-w-3xl gap-3 px-6 pb-16 sm:grid-cols-2">
        {LINKS.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="group flex items-center gap-3 rounded-2xl border bg-card px-4 py-3.5 transition-colors hover:border-foreground/30">
              <span className="grid size-9 place-items-center rounded-xl border bg-background"><Icon className="size-4" /></span>
              <span className="flex-1 text-sm font-medium">{label}</span>
              <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
