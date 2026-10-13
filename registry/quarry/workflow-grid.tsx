"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { GitPullRequest, Code2, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

const WORKFLOWS: { icon: ReactNode; title: string; description: string }[] = [
  { icon: <Code2 className="size-9" strokeWidth={1.5} />, title: "Runtime SDK", description: "Drop in a single script tag and optimise assets instantly in the browser." },
  { icon: <Terminal className="size-9" strokeWidth={1.5} />, title: "Command line", description: "Optimise local repositories and assets with one terminal command." },
  { icon: <GitPullRequest className="size-9" strokeWidth={1.5} />, title: "Pull requests", description: "Let automated pull requests refactor your codebase for you." },
];

export function WorkflowGrid({ className }: { className?: string }) {
  return (
    <section className={cn("w-full px-6 py-10 sm:px-10", className)}>
      <div className="mx-auto max-w-4xl">
        <div className="text-center">
          <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Fits every workflow
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three ways to ship faster with zero configuration.
          </p>
        </div>

        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {WORKFLOWS.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative mb-6 grid size-32 place-items-center rounded-full border bg-card text-foreground shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-primary/40 group-hover:text-primary group-hover:shadow-lg group-hover:shadow-primary/10">
                <span className="absolute inset-0 rounded-full bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
                <span className="relative">{item.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
