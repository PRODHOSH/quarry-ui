"use client";

import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, File as FileIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { id: string; file: File; progress: number; error?: string };

const size = (b: number) => (b < 1024 ** 2 ? `${Math.max(1, Math.round(b / 1024))} KB` : `${(b / 1024 ** 2).toFixed(1)} MB`);

/**
 * A drag and drop file area with a click fallback. It validates type and size, then lists each file with a
 * progress bar. Pass upload to send files for real; without it, progress is simulated for the preview.
 */
export function DropZone({
  accept,
  maxSizeMB = 10,
  multiple = true,
  upload,
  onFiles,
  className,
}: {
  /** Comma separated, same as the input accept attribute. For example "image/*,.pdf". */
  accept?: string;
  maxSizeMB?: number;
  multiple?: boolean;
  /** Return a promise. Call report(0 to 100) as it goes. */
  upload?: (file: File, report: (percent: number) => void) => Promise<void>;
  onFiles?: (files: File[]) => void;
  className?: string;
}) {
  const [items, setItems] = useState<Item[]>([]);
  const [over, setOver] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach(clearInterval), []);

  const patch = (id: string, p: Partial<Item>) => setItems((cur) => cur.map((i) => (i.id === id ? { ...i, ...p } : i)));

  const run = useCallback(
    (item: Item) => {
      if (upload) {
        upload(item.file, (percent) => patch(item.id, { progress: percent })).then(
          () => patch(item.id, { progress: 100 }),
          () => patch(item.id, { error: "Upload failed" })
        );
        return;
      }
      const t = window.setInterval(() => {
        setItems((cur) =>
          cur.map((i) => (i.id === item.id ? { ...i, progress: Math.min(100, i.progress + 6 + Math.random() * 10) } : i))
        );
      }, 140);
      timers.current.push(t);
    },
    [upload]
  );

  const add = (list: FileList | File[]) => {
    const next: Item[] = [];
    const patterns = (accept ?? "").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean);
    Array.from(list).slice(0, multiple ? undefined : 1).forEach((file) => {
      const okType = !patterns.length || patterns.some((p) => (p.startsWith(".") ? file.name.toLowerCase().endsWith(p) : p.endsWith("/*") ? file.type.startsWith(p.slice(0, -1)) : file.type === p));
      const error = !okType ? "File type not allowed" : file.size > maxSizeMB * 1024 ** 2 ? `Larger than ${maxSizeMB} MB` : undefined;
      next.push({ id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`, file, progress: 0, error });
    });
    setItems((cur) => (multiple ? [...cur, ...next] : next));
    next.filter((n) => !n.error).forEach(run);
    onFiles?.(next.filter((n) => !n.error).map((n) => n.file));
  };

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setOver(false);
    if (e.dataTransfer.files.length) add(e.dataTransfer.files);
  };

  return (
    <div className={cn("w-full max-w-xl", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => input.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), input.current?.click())}
        onDragOver={(e) => { e.preventDefault(); setOver(true); }}
        onDragLeave={() => setOver(false)}
        onDrop={onDrop}
        className={cn(
          "group relative flex cursor-pointer flex-col items-center gap-3 rounded-3xl border-2 border-dashed bg-card px-6 py-12 text-center transition-all duration-300 outline-none focus-visible:ring-4 focus-visible:ring-ring/25",
          over ? "scale-[1.01] border-primary bg-accent" : "hover:border-primary/60"
        )}
      >
        <span className={cn("grid size-14 place-items-center rounded-2xl bg-muted transition-transform duration-300", over && "-translate-y-1 scale-110 bg-primary text-primary-foreground")}>
          <UploadCloud className="size-6" />
        </span>
        <div>
          <p className="text-base font-medium">{over ? "Drop to upload" : "Drag files here, or click to browse"}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {accept ? accept.replace(/,/g, ", ") : "Any file"} · up to {maxSizeMB} MB{multiple ? " each" : ""}
          </p>
        </div>
        <input ref={input} type="file" hidden accept={accept} multiple={multiple} onChange={(e) => { if (e.target.files) add(e.target.files); e.target.value = ""; }} />
      </div>

      <ul className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {items.map((it) => {
            const pct = Math.round(it.progress);
            return (
              <motion.li key={it.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97 }} className="flex items-center gap-3 rounded-2xl border bg-card p-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-muted text-muted-foreground"><FileIcon className="size-4" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="truncate text-sm font-medium">{it.file.name}</p>
                    <span className={cn("shrink-0 text-xs", it.error ? "text-destructive" : "text-muted-foreground")}>{it.error ?? (pct >= 100 ? "Done" : `${pct}%`)}</span>
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className={cn("h-full rounded-full transition-[width] duration-200", it.error ? "bg-destructive" : "bg-primary")} style={{ width: it.error ? "100%" : `${pct}%` }} />
                  </div>
                  <p className="mt-1.5 text-xs text-muted-foreground">{size(it.file.size)}</p>
                </div>
                <button type="button" aria-label={`Remove ${it.file.name}`} onClick={() => setItems((c) => c.filter((x) => x.id !== it.id))} className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  {pct >= 100 && !it.error ? <Check className="size-4 text-primary" /> : <X className="size-4" />}
                </button>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </ul>
    </div>
  );
}
