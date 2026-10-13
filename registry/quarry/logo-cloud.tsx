"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Aperture, Atom, Cloud, Hexagon, Layers, Orbit, Triangle, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

type Logo = { name: string; icon: ReactNode };

const LOGOS: Logo[] = [
  { name: "Vertex", icon: <Triangle /> },
  { name: "Lumen", icon: <Aperture /> },
  { name: "Nimbus", icon: <Cloud /> },
  { name: "Atomic", icon: <Atom /> },
  { name: "Stratum", icon: <Layers /> },
  { name: "Orbital", icon: <Orbit /> },
  { name: "Hexa", icon: <Hexagon /> },
  { name: "Voltage", icon: <Zap /> },
];

/**
 * A "trusted by" strip. Logos sit muted in a slow endless row, fade at both edges, and the whole
 * row eases to a pause while the pointer is over it so each name can be read and lit up.
 */
export function LogoCloud({ logos = LOGOS, label = "Trusted by teams at", className }: { logos?: Logo[]; label?: string; className?: string }) {
  return (
    <section className={cn("w-full py-8", className)}>
      <p className="mb-8 text-center text-sm text-muted-foreground">{label}</p>
      <div className="group/row overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="flex w-max items-center gap-14 pr-14 group-hover/row:[animation-play-state:paused]"
        >
          {[...logos, ...logos].map((l, i) => (
            <div key={i} className="flex items-center gap-2.5 text-muted-foreground/70 transition-all duration-300 hover:scale-105 hover:text-foreground [&_svg]:size-6">
              {l.icon}
              <span className="text-lg font-semibold tracking-tight">{l.name}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
