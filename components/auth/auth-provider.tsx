"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { authConfigured, getSupabase } from "@/lib/supabase/client";

export type Provider = "google" | "github";
export type BookmarkKind = "components" | "templates" | "backgrounds" | "loaders" | "design";

type Ctx = {
  user: User | null;
  /** Avatar from the account the person signed in with. */
  avatar: string | null;
  name: string | null;
  provider: Provider | null;
  loading: boolean;
  configured: boolean;
  dialogOpen: boolean;
  /** Why the popup opened, shown under the logo. */
  reason: string | null;
  openSignIn: (reason?: string) => void;
  closeSignIn: () => void;
  getAccessToken: () => Promise<string | null>;
  signIn: (p: Provider) => Promise<string | null>;
  signOut: () => Promise<void>;
  isBookmarked: (kind: BookmarkKind, slug: string) => boolean;
  toggleBookmark: (kind: BookmarkKind, slug: string) => Promise<void>;
  bookmarks: Set<string>;
};

const AuthContext = createContext<Ctx | null>(null);

const key = (kind: BookmarkKind, slug: string) => `${kind}:${slug}`;

export function useAuth() {
  const c = useContext(AuthContext);
  if (!c) throw new Error("useAuth must be used inside AuthProvider");
  return c;
}

/**
 * Holds the signed in person and their bookmarks for the whole app. Sign in uses Supabase OAuth
 * with Google or GitHub. Bookmarks live in a `bookmarks` table protected by row level security.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(authConfigured);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [reason, setReason] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    let alive = true;
    sb.auth.getSession().then(({ data }) => {
      if (!alive) return;
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s) setDialogOpen(false);
    });
    return () => {
      alive = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const uid = session?.user.id ?? null;
  useEffect(() => {
    const sb = getSupabase();
    if (!sb || !uid) return;
    let alive = true;
    sb.from("bookmarks")
      .select("kind, slug")
      .then(({ data }) => {
        if (alive) setBookmarks(new Set((data ?? []).map((r) => key(r.kind as BookmarkKind, r.slug as string))));
      });
    return () => {
      alive = false;
    };
  }, [uid]);

  const signIn = useCallback(async (p: Provider) => {
    const sb = getSupabase();
    if (!sb) return "Sign in is not set up yet. Add your Supabase keys to enable it.";
    const { error } = await sb.auth.signInWithOAuth({ provider: p, options: { redirectTo: window.location.href } });
    return error ? error.message : null;
  }, []);

  const getAccessToken = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) return null;
    const { data } = await sb.auth.getSession();
    return data.session?.access_token ?? null;
  }, []);

  const signOut = useCallback(async () => {
    await getSupabase()?.auth.signOut();
    setBookmarks(new Set());
  }, []);

  const toggleBookmark = useCallback(
    async (kind: BookmarkKind, slug: string) => {
      const sb = getSupabase();
      if (!sb || !uid) {
        setDialogOpen(true);
        return;
      }
      const k = key(kind, slug);
      const had = bookmarks.has(k);
      // update the screen first, then confirm with the database
      setBookmarks((prev) => {
        const next = new Set(prev);
        if (had) next.delete(k);
        else next.add(k);
        return next;
      });
      const { error } = had ? await sb.from("bookmarks").delete().match({ kind, slug }) : await sb.from("bookmarks").insert({ kind, slug });
      if (error) {
        setBookmarks((prev) => {
          const next = new Set(prev);
          if (had) next.add(k);
          else next.delete(k);
          return next;
        });
      }
    },
    [uid, bookmarks]
  );

  const value = useMemo<Ctx>(() => {
    const u = session?.user ?? null;
    const meta = (u?.user_metadata ?? {}) as Record<string, string | undefined>;
    const prov = (u?.app_metadata?.provider as Provider | undefined) ?? null;
    return {
      user: u,
      avatar: meta.avatar_url ?? meta.picture ?? null,
      name: meta.full_name ?? meta.name ?? meta.user_name ?? u?.email?.split("@")[0] ?? null,
      provider: prov === "google" || prov === "github" ? prov : null,
      loading,
      configured: authConfigured,
      dialogOpen,
      reason,
      openSignIn: (why) => {
        setReason(typeof why === "string" ? why : null);
        setDialogOpen(true);
      },
      closeSignIn: () => setDialogOpen(false),
      getAccessToken,
      signIn,
      signOut,
      isBookmarked: (kind, slug) => bookmarks.has(key(kind, slug)),
      toggleBookmark,
      bookmarks,
    };
  }, [session, loading, dialogOpen, reason, signIn, signOut, getAccessToken, bookmarks, toggleBookmark]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
