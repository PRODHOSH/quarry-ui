import { highlight } from "@/lib/highlight";
import { CopyButton } from "@/components/site/copy-button";
import { cn } from "@/lib/utils";

export async function CodeBlock({
  code,
  lang = "tsx",
  title,
  maxHeight,
  className,
}: {
  code: string;
  lang?: string;
  title?: string;
  /** Tailwind max-height class, e.g. "max-h-[32rem]". */
  maxHeight?: string;
  className?: string;
}) {
  const html = await highlight(code.trim(), lang);

  return (
    <div className={cn("overflow-hidden rounded-xl border bg-card", className)}>
      <div className="flex items-center justify-between border-b px-4 py-1.5">
        <span className="font-mono text-xs text-muted-foreground">{title ?? lang}</span>
        <CopyButton value={code.trim()} />
      </div>
      <div
        className={cn("code-block overflow-auto text-[13px] leading-relaxed", maxHeight)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
