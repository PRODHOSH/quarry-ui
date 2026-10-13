"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

/** The logo as a giant wordmark that rises into place as the footer scrolls in. */
export function FooterWordmark() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const y = useTransform(scrollYProgress, [0, 1], ["35%", "0%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [0.06, 0.2]);

  return (
    <div ref={ref} aria-hidden className="relative mx-auto mt-10 max-w-6xl select-none overflow-hidden px-6">
      <motion.div style={{ y, opacity }}>
        <Image
          src="/brand/logo.png"
          alt=""
          width={1738}
          height={389}
          sizes="100vw"
          className="h-auto w-full [mask-image:linear-gradient(180deg,#000_55%,transparent_100%)]"
        />
      </motion.div>
    </div>
  );
}
