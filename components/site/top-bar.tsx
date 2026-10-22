"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, LogOut, MessageSquare } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Skeleton } from "@/components/ui/skeleton";
import { CONTACT_EMAIL } from "@/lib/site";

/** A slim bar across the top of the page: waitlist, feedback, bookmarks and the account. */
export function TopBar() {
  const { user, avatar, name, provider, loading, openSignIn, signOut } = useAuth();
  const [menu, setMenu] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menu) return;
    const close = (e: MouseEvent) => !ref.current?.contains(e.target as Node) && setMenu(false);
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [menu]);

  const pill = "inline-flex h-9 items-center gap-1.5 rounded-full border bg-card/70 px-3.5 text-sm text-muted-foreground backdrop-blur transition-colors hover:border-foreground/30 hover:text-foreground";

  return (
    <div className="relative z-30 hidden h-16 items-center justify-end gap-2 px-8 lg:flex lg:px-12">
      <Link href="/waitlist" className={pill}>
        <span className="font-medium text-foreground">Join waitlist</span>
      </Link>
      <a href={`mailto:${CONTACT_EMAIL}?subject=Quarry%20UI%20feedback`} className={pill}>
        <MessageSquare className="size-4" /> Feedback
      </a>
      <Link href="/bookmarks" aria-label="Bookmarks" title="Bookmarks" className="grid size-9 place-items-center rounded-full border bg-card/70 text-muted-foreground backdrop-blur transition-colors hover:border-foreground/30 hover:text-foreground">
        <Bookmark className="size-4" />
      </Link>

      <div ref={ref} className="relative">
        {user ? (
          <>
            <button type="button" onClick={() => setMenu((m) => !m)} aria-label="Account menu" aria-expanded={menu} className="block size-9 overflow-hidden rounded-full border bg-muted ring-offset-background transition-shadow hover:ring-2 hover:ring-foreground/20">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatar} alt={name ?? "Your avatar"} referrerPolicy="no-referrer" className="size-full object-cover" />
              ) : (
                <span className="grid size-full place-items-center text-sm font-semibold">{(name ?? "?")[0]?.toUpperCase()}</span>
              )}
            </button>
            <AnimatePresence>
              {menu && (
                <motion.div initial={{ opacity: 0, y: -6, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -6, scale: 0.97 }} transition={{ duration: 0.15 }} className="absolute right-0 top-full mt-2 w-64 origin-top-right overflow-hidden rounded-2xl border bg-card p-1.5 shadow-2xl">
                  <div className="px-3 py-2.5">
                    <p className="truncate text-sm font-medium">{name}</p>
                    <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    {provider && <p className="mt-1.5 text-[11px] text-muted-foreground/80">Signed in with {provider === "google" ? "Google" : "GitHub"}</p>}
                  </div>
                  <div className="my-1 h-px bg-border" />
                  <Link href="/bookmarks" onClick={() => setMenu(false)} className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors hover:bg-muted">
                    <Bookmark className="size-4 text-muted-foreground" /> Your bookmarks
                  </Link>
                  <button type="button" onClick={() => { setMenu(false); signOut(); }} className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm transition-colors hover:bg-muted">
                    <LogOut className="size-4 text-muted-foreground" /> Sign out
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : loading ? (
          <Skeleton className="h-9 w-20 rounded-full" />
        ) : (
          <button type="button" onClick={() => openSignIn()} className="inline-flex h-9 items-center rounded-full bg-primary px-4 text-sm font-medium text-primary-foreground transition-transform active:scale-95 disabled:opacity-60">
            Sign in
          </button>
        )}
      </div>
    </div>
  );
}
