"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useAnimationFrame, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { DEMOS } from "@/registry/demos";

type Item = { name: string; title: string };

const CARD_W = 400;
const CARD_H = 250;

function Face({ name, title }: Item) {
  const Demo = DEMOS[name];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-card shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]" style={{ width: CARD_W }}>
      <div className="pointer-events-none relative overflow-hidden bg-background" style={{ width: CARD_W, height: CARD_H }} aria-hidden>
        <div className="absolute left-0 top-0 flex origin-top-left items-center" style={{ width: 900, height: 562, transform: `scale(${CARD_W / 900})` }}>
          {Demo ? <Demo /> : null}
        </div>
      </div>
      <p className="flex h-10 items-center justify-between border-t px-4 text-[13px]">
        {title}
        <ArrowUpRight className="size-4 text-muted-foreground transition-transform duration-500 group-hover:-translate-y-px group-hover:translate-x-px group-hover:text-foreground" />
      </p>
      {/* An overlay link, because the previews can contain their own links and anchors cannot nest. */}
      <Link href={`/components/${name}`} aria-label={title} className="absolute inset-0 z-10" />
    </div>
  );
}

/** Live components on a slowly turning ring. Move the pointer to tilt it, hover to hold it still. */
export function Ring3D({ items }: { items: Item[] }) {
  const n = items.length;
  const step = 360 / n;
  const radius = Math.round((CARD_W / 2 + 14) / Math.tan(Math.PI / n));
  const spin = useMotionValue(0);
  const [paused, setPaused] = useState(false);
  const reduced = useRef(false);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltY = useSpring(useTransform(px, [-1, 1], [-10, 10]), { stiffness: 80, damping: 18 });
  const tiltX = useSpring(useTransform(py, [-1, 1], [-4, -12]), { stiffness: 80, damping: 18 });

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useAnimationFrame((_, delta) => {
    if (paused || reduced.current) return;
    spin.set(spin.get() - delta * 0.0085);
  });

  return (
    <div
      className="relative h-full w-full overflow-hidden [perspective:1500px] [mask-image:linear-gradient(90deg,transparent,#000_14%,#000_96%,transparent)]"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        px.set(((e.clientX - r.left) / r.width) * 2 - 1);
        py.set(((e.clientY - r.top) / r.height) * 2 - 1);
      }}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => {
        setPaused(false);
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div className="absolute inset-0 [transform-style:preserve-3d]" style={{ rotateX: tiltX, rotateY: tiltY }}>
        <motion.div className="absolute left-[52%] top-1/2 [transform-style:preserve-3d]" style={{ rotateY: spin, z: -radius, width: 0, height: 0 }}>
          {items.map((it, i) => (
            <div
              key={it.name}
              className="absolute [backface-visibility:hidden]"
              style={{
                width: CARD_W,
                left: -CARD_W / 2,
                top: -(CARD_H + 40) / 2,
                transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
              }}
            >
              <Face {...it} />
            </div>
          ))}
        </motion.div>
      </motion.div>
      {/* a soft floor glow under the ring */}
      <div aria-hidden className="pointer-events-none absolute inset-x-[10%] bottom-[8%] h-24 rounded-[50%] bg-brand/20 blur-3xl" />
    </div>
  );
}
