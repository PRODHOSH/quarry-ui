"use client";

import { motion } from "framer-motion";
import { Bookmark } from "lucide-react";
import { useAuth, type BookmarkKind } from "@/components/auth/auth-provider";
import { cn } from "@/lib/utils";

/**
 * A bookmark toggle for any item. Signed out, it opens the sign in popup. Signed in, it saves or
 * removes the item and fills in right away. Use `variant="pill"` for a labelled button.
 */
export function BookmarkButton({
  kind,
  slug,
  variant = "icon",
  className,
}: {
  kind: BookmarkKind;
  slug: string;
  variant?: "icon" | "pill";
  className?: string;
}) {
  const { isBookmarked, toggleBookmark } = useAuth();
  const on = isBookmarked(kind, slug);

  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Remove bookmark" : "Bookmark"}
      title={on ? "Remove bookmark" : "Bookmark"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleBookmark(kind, slug);
      }}
      className={cn(
        variant === "icon"
          ? "grid size-9 place-items-center rounded-full border bg-background/90 text-muted-foreground shadow-sm backdrop-blur transition-colors hover:text-foreground"
          : "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-colors hover:bg-muted",
        on && "text-foreground",
        className
      )}
    >
      <motion.span key={String(on)} initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 16 }} className="flex">
        <Bookmark className={cn("size-4", on && "fill-current")} />
      </motion.span>
      {variant === "pill" && (on ? "Saved" : "Save")}
    </button>
  );
}
