"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** A hairline at the very top of the viewport that fills as you read down the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      className="fixed inset-x-0 top-0 z-[60] h-px origin-left bg-foreground"
      style={{ scaleX }}
    />
  );
}
