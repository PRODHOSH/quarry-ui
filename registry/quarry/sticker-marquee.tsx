import { cn } from "@/lib/utils";

const SKILLS = [
  "Next.js", "React", "TypeScript", "Tailwind", "Framer Motion", "Three.js", "Figma", "Node.js", "Python", "PostgreSQL",
  "Supabase", "Docker", "Vercel", "Design systems", "Accessibility", "SEO", "Prototyping", "Testing",
];
const TONE = [
  "bg-background text-primary",
  "bg-foreground text-background",
  "text-primary-foreground ring-[3px] ring-inset ring-primary-foreground",
];

function Row({ items, reverse, offset }: { items: string[]; reverse?: boolean; offset: number }) {
  return (
    <div className="group overflow-hidden py-3">
      <div className={cn("flex w-max motion-reduce:animate-none group-hover:[animation-play-state:paused]", reverse ? "[animation:qmq_44s_linear_infinite_reverse]" : "[animation:qmq_38s_linear_infinite]")} aria-hidden={reverse || undefined}>
        {[0, 1].map((k) => (
          <ul key={k} className="flex shrink-0 gap-3.5 pr-3.5">
            {items.map((s, i) => (
              <li
                key={s}
                style={{ rotate: `${((i * 7 + offset * 3) % 9) - 4}deg` }}
                className={cn(
                  "whitespace-nowrap rounded-full px-[0.95em] pb-[0.3em] pt-[0.35em] font-[family-name:var(--font-anton)] text-[clamp(1.8rem,4.6vw,4.4rem)] uppercase leading-[1.1] transition-all duration-500 hover:!rotate-0 hover:scale-105 hover:bg-foreground hover:text-background",
                  TONE[(i + offset) % 3]
                )}
              >
                {s}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

/**
 * Two rows of tilted stickers that slide in opposite directions. The first row speeds along, the
 * second goes back the other way, and either one pauses while the pointer is over it. It is pure
 * CSS, so it costs nothing to run and stops for people who prefer less motion.
 */
export function StickerMarquee({ title = ["Tools of", "the trade"], items = SKILLS, className }: { title?: [string, string]; items?: string[]; className?: string }) {
  const half = Math.ceil(items.length / 2);
  return (
    <section className={cn("w-full overflow-hidden bg-primary py-16 text-primary-foreground", className)}>
      <style>{"@keyframes qmq{to{transform:translateX(-50%)}}"}</style>
      <h2 className="mb-8 px-6 text-center font-[family-name:var(--font-anton)] text-[clamp(2.6rem,9vw,8rem)] uppercase leading-[0.95]">
        <span className="block">{title[0]}</span>
        <span className="block text-foreground">{title[1]}</span>
      </h2>
      <Row items={items.slice(0, half)} offset={0} />
      <Row items={items.slice(half)} reverse offset={1} />
    </section>
  );
}
