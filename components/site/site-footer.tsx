import Link from "next/link";
import { FooterWordmark } from "@/components/site/footer-wordmark";
import { Logo } from "@/components/site/logo";
import { SOCIAL } from "@/lib/site";

const COLUMNS: { title: string; links: { label: string; href: string; external?: boolean; soon?: boolean }[] }[] = [
  {
    title: "Library",
    links: [
      { label: "All components", href: "/components" },
      { label: "Sections", href: "/components#group-sections" },
      { label: "Elements", href: "/components#group-elements" },
      { label: "Loaders", href: "/components#group-loaders" },
      { label: "Templates", href: "/#components", soon: true },
    ],
  },
  {
    title: "Product",
    links: [
      { label: "How it works", href: "/#how" },
      { label: "Pricing", href: "/#pricing" },
      { label: "MCP server", href: "/#mcp", soon: true },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "shadcn registry", href: "https://ui.shadcn.com/docs/registry", external: true },
      { label: "Install a component", href: "/components/feature-bento" },
      { label: "Get launch updates", href: "/#waitlist" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "GitHub", href: SOCIAL.github, external: true },
      { label: "X (Twitter)", href: SOCIAL.x, external: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="overflow-hidden border-t">
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_3fr]">
          <div>
            <Logo size="lg" />
            <p className="mt-5 max-w-xs text-sm font-normal leading-relaxed text-muted-foreground">
              Free, production-ready React components and templates, distributed as a shadcn
              registry. Copy it, own it, ship it.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-4">
            {COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="text-sm font-medium">{column.title}</h3>
                <ul className="mt-4 space-y-3">
                  {column.links.map((link) => {
                    const className =
                      "inline-flex items-center gap-2 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground";
                    const content = (
                      <>
                        {link.label}
                        {link.soon && (
                          <span className="text-[11px] text-muted-foreground/60">Soon</span>
                        )}
                      </>
                    );
                    return (
                      <li key={link.label}>
                        {link.external ? (
                          <a href={link.href} target="_blank" rel="noreferrer" className={className}>
                            {content}
                          </a>
                        ) : (
                          <Link href={link.href} className={className}>
                            {content}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t pt-6 text-xs font-normal text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Quarry UI. All rights reserved.</p>
          <p>Free for personal and commercial use.</p>
        </div>
      </div>
      <FooterWordmark />
    </footer>
  );
}
