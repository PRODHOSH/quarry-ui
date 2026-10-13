"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const REWARDS = [
  {
    title: "Premium digital identity",
    description:
      "The top 10 members receive a free year of a custom domain to launch their portfolio.",
  },
  {
    title: "Exclusive event swag",
    description:
      "Weekly top performers get partner goodies: t-shirts for the top three, books for the rest.",
  },
  {
    title: "Limited edition swag kit",
    description:
      "Official tees, personalised notebooks and premium notes for everyone who reaches the final round.",
  },
];

export function RewardsList({ className }: { className?: string }) {
  return (
    <section className={cn("w-full px-6 py-10 sm:px-10", className)}>
      <div className="mx-auto grid max-w-4xl gap-10 lg:grid-cols-[2fr_3fr] lg:gap-16">
        <div>
          <p className="text-sm font-medium text-primary">Leaderboard</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Climb the ranks, earn real rewards
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every action counts toward your score. Rankings update live, and the best performers
            are recognised at the end of the programme.
          </p>
        </div>

        <ol className="divide-y rounded-2xl border bg-card">
          {REWARDS.map((reward, i) => (
            <motion.li
              key={reward.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex gap-5 p-5 sm:p-6"
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                {i + 1}
              </span>
              <div>
                <h3 className="font-semibold text-card-foreground">{reward.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {reward.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
