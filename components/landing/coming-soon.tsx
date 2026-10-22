"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { WaitlistForm } from "@/components/landing/waitlist-form";

const EASE = [0.32, 0.72, 0, 1] as const;
const rise = (i: number) => ({
  initial: { opacity: 0, y: 18, filter: "blur(8px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  transition: { duration: 1, delay: 0.15 + i * 0.12, ease: EASE },
});

/** The home page for now: the logo and the waiting list. Nothing else. */
export function ComingSoon() {
  return (
    <section className="flex min-h-[72svh] items-center justify-center px-6 py-10">
      <div className="flex w-full max-w-xl flex-col items-center text-center">
        <motion.div {...rise(0)} className="w-full">
          <h1 className="sr-only">Quarry UI</h1>
          <Image src="/brand/logo.png" alt="Quarry UI" width={1738} height={389} priority sizes="(min-width:768px) 480px, 80vw" className="mx-auto h-auto w-[min(80vw,30rem)]" />
        </motion.div>

        <motion.p {...rise(1)} className="font-label mt-10 text-xs uppercase tracking-[0.22em] text-muted-foreground">
          Coming soon
        </motion.p>

        <motion.p {...rise(2)} className="mt-4 text-2xl font-medium tracking-tight sm:text-3xl">
          Join the waiting list.
        </motion.p>

        <motion.div {...rise(3)} id="waitlist" className="mt-8 flex w-full scroll-mt-28 flex-col items-center">
          <WaitlistForm />
        </motion.div>
      </div>
    </section>
  );
}
