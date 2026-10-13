"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/site/logo";
import { CONTACT_EMAIL, SOCIAL } from "@/lib/site";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/templates", label: "Templates" },
  { href: "/components", label: "Components" },
];

const GithubMark = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="size-[18px]" aria-hidden>
    <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.18 1.83 1.18 3.09 0 4.42-2.69 5.39-5.25 5.68.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5Z" />
  </svg>
);

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const wide = pathname.startsWith("/components") || pathname.startsWith("/templates");

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (pathname.startsWith("/preview")) return null;

  // The home page is a quiet waiting-list screen: no logo, no menu, just a way to get in touch.
  if (pathname === "/") {
    return (
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-end px-6">
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
            Contact
          </a>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-md">
      <div
        className={cn(
          "mx-auto grid h-16 grid-cols-[1fr_auto_1fr] items-center px-6",
          !wide && "max-w-6xl"
        )}
      >
        <Logo />

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-sm font-normal text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="col-start-3 flex items-center justify-end gap-1.5">
          <a
            href={SOCIAL.github}
            target="_blank"
            rel="noreferrer"
            aria-label="Quarry UI on GitHub"
            className="hidden size-9 place-items-center rounded-full text-muted-foreground transition-colors hover:text-foreground sm:grid"
          >
            <GithubMark />
          </a>
          <Link
            href="/#waitlist"
            className="hidden h-9 items-center rounded-full bg-foreground px-4 text-sm font-medium text-background transition-opacity hover:opacity-85 sm:inline-flex"
          >
            Join waitlist
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="grid size-9 place-items-center rounded-full text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          aria-label="Mobile"
          className="hero-in absolute inset-x-0 top-16 h-[calc(100svh-4rem)] border-t bg-background px-5 py-6 md:hidden"
        >
          <ul className="space-y-1">
            {LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block border-b py-4 text-2xl font-medium"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/#waitlist"
            onClick={() => setOpen(false)}
            className="mt-8 flex h-12 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
          >
            Join waitlist
          </Link>
        </nav>
      )}
    </header>
  );
}
