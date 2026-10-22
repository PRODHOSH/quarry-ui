"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string; hint?: string };

const OPTIONS: SelectOption[] = [
  { value: "newest", label: "Newest first", hint: "Latest arrivals" },
  { value: "popular", label: "Most popular", hint: "What people love" },
  { value: "low", label: "Price: low to high" },
  { value: "high", label: "Price: high to low" },
  { value: "rated", label: "Best rated", hint: "4 stars and up" },
];

/**
 * A fully styled select that behaves like the native one. Arrow keys, Home, End and typing a letter
 * move through options, Enter picks, Escape closes, and the list opens with a short spring. Controlled
 * with `value` and `onChange`, or uncontrolled.
 */
export function CustomSelect({
  options = OPTIONS,
  value,
  defaultValue,
  onChange,
  label = "Sort by",
  className,
}: {
  options?: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  label?: string;
  className?: string;
}) {
  const [inner, setInner] = useState(defaultValue ?? options[0]?.value);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const id = useId();
  const current = value ?? inner;
  const selected = options.find((o) => o.value === current) ?? options[0];

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => !root.current?.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const pick = (i: number) => {
    const o = options[i];
    setInner(o.value);
    onChange?.(o.value);
    setOpen(false);
  };
  const openList = () => {
    setActive(Math.max(0, options.findIndex((o) => o.value === current)));
    setOpen(true);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) { e.preventDefault(); openList(); }
      return;
    }
    if (e.key === "Escape") setOpen(false);
    else if (e.key === "ArrowDown") setActive((a) => (a + 1) % options.length);
    else if (e.key === "ArrowUp") setActive((a) => (a - 1 + options.length) % options.length);
    else if (e.key === "Home") setActive(0);
    else if (e.key === "End") setActive(options.length - 1);
    else if (e.key === "Enter" || e.key === " ") pick(active);
    else if (e.key.length === 1) {
      const i = options.findIndex((o, n) => n > active && o.label.toLowerCase().startsWith(e.key.toLowerCase()));
      const j = i === -1 ? options.findIndex((o) => o.label.toLowerCase().startsWith(e.key.toLowerCase())) : i;
      if (j !== -1) setActive(j);
      return;
    } else return;
    e.preventDefault();
  };

  return (
    <div ref={root} className={cn("relative w-64", className)}>
      <span id={`${id}-label`} className="mb-1.5 block text-xs font-medium text-muted-foreground">{label}</span>
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={`${id}-label`}
        aria-controls={`${id}-list`}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKey}
        className={cn("flex h-11 w-full items-center justify-between rounded-xl border bg-card px-4 text-left text-sm outline-none transition-colors focus-visible:border-primary", open && "border-primary")}
      >
        <span className="truncate font-medium">{selected?.label}</span>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform duration-200", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id={`${id}-list`}
            role="listbox"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 right-0 top-full z-20 mt-2 origin-top overflow-hidden rounded-xl border bg-card p-1 shadow-xl"
          >
            {options.map((o, i) => (
              <li key={o.value} role="option" aria-selected={o.value === current} onMouseEnter={() => setActive(i)} onClick={() => pick(i)} className={cn("flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors", i === active && "bg-muted")}>
                <span className="min-w-0 flex-1"><span className="block truncate font-medium">{o.label}</span>{o.hint && <span className="block truncate text-xs text-muted-foreground">{o.hint}</span>}</span>
                {o.value === current && <Check className="size-4 text-primary" />}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
