"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CornerDownLeft, FileText, Folder, Search, Settings, User } from "lucide-react";
import { cn } from "@/lib/utils";

export type CommandItem = {
  id: string;
  label: string;
  group: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect?: () => void;
};

const DEFAULT_ITEMS: CommandItem[] = [
  { id: "new", label: "New project", group: "Create", icon: <Folder />, shortcut: "N" },
  { id: "doc", label: "New document", group: "Create", icon: <FileText />, shortcut: "D" },
  { id: "profile", label: "Open profile", group: "Go to", icon: <User />, shortcut: "P" },
  { id: "settings", label: "Open settings", group: "Go to", icon: <Settings />, shortcut: "," },
  { id: "billing", label: "Billing and plans", group: "Go to", icon: <FileText /> },
  { id: "invite", label: "Invite a teammate", group: "Team", icon: <User />, shortcut: "I" },
];

function Palette({ items, placeholder, onClose }: { items: CommandItem[]; placeholder: string; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? items.filter((i) => i.label.toLowerCase().includes(q) || i.group.toLowerCase().includes(q)) : items;
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    results.forEach((r) => map.set(r.group, [...(map.get(r.group) ?? []), r]));
    return [...map.entries()];
  }, [results]);

  const run = (item?: CommandItem) => {
    if (!item) return;
    item.onSelect?.();
    onClose();
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setIndex((i) => Math.min(results.length - 1, i + 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setIndex((i) => Math.max(0, i - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); run(results[index]); }
    else if (e.key === "Escape") onClose();
  };

  let flat = -1;

  return (
    <motion.div
      role="dialog"
      aria-label="Command menu"
      initial={{ opacity: 0, scale: 0.97, y: -8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97, y: -8 }}
      transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
      onKeyDown={onKeyDown}
      className="w-full max-w-lg overflow-hidden rounded-2xl border bg-card shadow-2xl"
    >
      <div className="flex items-center gap-3 border-b px-4">
        <Search className="size-4 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => { setQuery(e.target.value); setIndex(0); }}
          placeholder={placeholder}
          className="h-12 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
        <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">ESC</kbd>
      </div>
      <div className="max-h-72 overflow-y-auto p-2">
        {groups.length === 0 && <p className="px-3 py-8 text-center text-sm text-muted-foreground">No results for “{query}”</p>}
        {groups.map(([group, list]) => (
          <div key={group} className="mb-1">
            <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-widest text-muted-foreground">{group}</p>
            {list.map((item) => {
              flat += 1;
              const i = flat;
              const active = i === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onMouseMove={() => setIndex(i)}
                  onClick={() => run(item)}
                  className={cn("flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors", active ? "bg-accent text-accent-foreground" : "text-foreground/80")}
                >
                  <span className="grid size-5 place-items-center text-muted-foreground [&_svg]:size-4">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {active ? <CornerDownLeft className="size-3.5 text-muted-foreground" /> : item.shortcut && <kbd className="rounded border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{item.shortcut}</kbd>}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/**
 * A keyboard first command palette. Opens with Cmd or Ctrl plus K, filters as you type, moves with the
 * arrow keys and runs with Enter. Control it with open and onOpenChange, or leave it to manage itself.
 */
export function CommandMenu({
  items = DEFAULT_ITEMS,
  open: openProp,
  onOpenChange,
  placeholder = "Type a command or search",
  position = "fixed",
  className,
}: {
  items?: CommandItem[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placeholder?: string;
  position?: "fixed" | "absolute";
  className?: string;
}) {
  const [inner, setInner] = useState(false);
  const open = openProp ?? inner;
  const setOpen = (v: boolean) => {
    setInner(v);
    onOpenChange?.(v);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setInner((v) => !v);
        onOpenChange?.(!open);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className={cn("inset-0 z-50 flex items-start justify-center bg-background/70 px-4 pt-[14%] backdrop-blur-sm", position, className)}
          onMouseDown={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <Palette items={items} placeholder={placeholder} onClose={() => setOpen(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
