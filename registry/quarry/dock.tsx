"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionValue } from "framer-motion";
import { Home, Mail, MessageCircle, Music2, Search, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export type DockItem = { label: string; icon: ReactNode; href?: string; onClick?: () => void };

const DEFAULT_ITEMS: DockItem[] = [
  { label: "Home", icon: <Home /> },
  { label: "Search", icon: <Search /> },
  { label: "Messages", icon: <MessageCircle /> },
  { label: "Mail", icon: <Mail /> },
  { label: "Music", icon: <Music2 /> },
  { label: "Settings", icon: <Settings /> },
];

function Icon({ item, mouseX, base, grow, reach }: { item: DockItem; mouseX: MotionValue<number>; base: number; grow: number; reach: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const distance = useTransform(mouseX, (x) => {
    const r = ref.current?.getBoundingClientRect();
    return r ? x - (r.left + r.width / 2) : reach * 2;
  });
  const size = useSpring(useTransform(distance, [-reach, 0, reach], [base, base * grow, base]), { stiffness: 320, damping: 24, mass: 0.4 });
  const Tag = item.href ? "a" : "button";

  return (
    <motion.div ref={ref} style={{ width: size, height: size }} className="group relative">
      <span className="pointer-events-none absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border bg-card px-2 py-1 text-xs opacity-0 shadow-lg transition-all duration-200 group-hover:-translate-y-0.5 group-hover:opacity-100">
        {item.label}
      </span>
      <Tag
        {...(item.href ? { href: item.href } : { type: "button" as const })}
        onClick={item.onClick}
        aria-label={item.label}
        className="grid size-full place-items-center rounded-2xl border bg-card text-foreground/80 shadow-sm transition-colors hover:bg-accent hover:text-foreground [&_svg]:size-[42%]"
      >
        {item.icon}
      </Tag>
    </motion.div>
  );
}

/**
 * A floating dock whose icons swell as the pointer approaches, like the macOS dock. The effect is
 * driven by distance, so neighbours grow a little too. Labels appear above the icon you hover.
 */
export function Dock({
  items = DEFAULT_ITEMS,
  size = 48,
  magnification = 1.7,
  className,
}: {
  items?: DockItem[];
  size?: number;
  magnification?: number;
  className?: string;
}) {
  const mouseX = useMotionValue(Infinity);
  return (
    <div
      onPointerMove={(e) => mouseX.set(e.clientX)}
      onPointerLeave={() => mouseX.set(Infinity)}
      className={cn("mx-auto flex w-max items-end gap-2 rounded-[1.6rem] border bg-card/70 p-2 shadow-2xl backdrop-blur-xl", className)}
      style={{ height: size + 20 }}
    >
      {items.map((it) => (
        <Icon key={it.label} item={it} mouseX={mouseX} base={size} grow={magnification} reach={size * 2.4} />
      ))}
    </div>
  );
}
