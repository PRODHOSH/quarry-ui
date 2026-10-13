"use client";

import { useEffect, useRef, useState } from "react";
import "@xterm/xterm/css/xterm.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@fontsource/jetbrains-mono/700.css";

type Rec = { cols: number; rows: number; events: { t: number; d: string }[] };

/** Progress (0..1) -> time inside the REAL recording (seconds). The idle waiting is skipped, nothing is invented. */
const MAP: [number, number][] = [
  [0, 6.9],
  [0.1, 8.06],
  [0.2, 10.62],
  [0.3, 14.0],
  [0.92, 90.9],
  [1, 91.5],
];
const recAt = (p: number) => {
  for (let i = 1; i < MAP.length; i++) {
    if (p <= MAP[i][0]) {
      const [p0, t0] = MAP[i - 1];
      const [p1, t1] = MAP[i];
      return t0 + ((t1 - t0) * (p - p0)) / (p1 - p0);
    }
  }
  return MAP[MAP.length - 1][1];
};

/**
 * A real Claude Code session, recorded byte for byte through a pseudo terminal and replayed in xterm.js.
 * Scroll progress scrubs it: forward and backward, deterministically.
 */
export function TermReplay({ progress }: { progress: number }) {
  const box = useRef<HTMLDivElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const engine = useRef<{
    seek: (sec: number) => Promise<void>;
    fit: () => void;
    dispose: () => void;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const target = useRef(0);
  const busy = useRef(false);

  useEffect(() => {
    let dead = false;
    (async () => {
      const [{ Terminal }, rec] = await Promise.all([
        import("@xterm/xterm"),
        fetch("/proof/claude_run.json").then((r) => r.json() as Promise<Rec>),
      ]);
      if (dead || !host.current || !box.current) return;
      const term = new Terminal({
        cols: rec.cols,
        rows: rec.rows,
        fontFamily: '"JetBrains Mono", monospace',
        fontSize: 12,
        lineHeight: 1.22,
        allowProposedApi: true,
        cursorBlink: false,
        cursorStyle: "block",
        cursorInactiveStyle: "none",
        scrollback: 0,
        customGlyphs: true,
        theme: {
          background: "#0b0b0c",
          foreground: "#e6e6e6",
          cursor: "#d97757",
          black: "#1c1c1e",
          red: "#ff6b6b",
          green: "#6fd08c",
          yellow: "#e6c07b",
          blue: "#7aa2f7",
          magenta: "#c792ea",
          cyan: "#56d4dd",
          white: "#e6e6e6",
          brightBlack: "#6b6b70",
          brightWhite: "#ffffff",
        },
      });
      term.open(host.current);
      let idx = 0;
      let cur = -1;
      const write = (d: string) => new Promise<void>((r) => term.write(d, r));
      const seek = async (sec: number) => {
        const ms = sec * 1000;
        if (ms < cur) {
          term.reset();
          idx = 0;
        }
        while (idx < rec.events.length && rec.events[idx].t <= ms) {
          await write(rec.events[idx].d);
          idx++;
        }
        cur = ms;
      };
      const fit = () => {
        if (!box.current || !host.current) return;
        const w = box.current.clientWidth;
        const fs = Math.max(7, Math.floor((w / (rec.cols * 0.6)) * 10) / 10);
        term.options.fontSize = fs;
        host.current.style.transform = "none";
      };
      fit();
      const ro = new ResizeObserver(fit);
      ro.observe(box.current);
      engine.current = { seek, fit, dispose: () => { ro.disconnect(); term.dispose(); } };
      setReady(true);
    })();
    return () => {
      dead = true;
      engine.current?.dispose();
      engine.current = null;
    };
  }, []);

  useEffect(() => {
    target.current = recAt(progress);
    if (!ready || busy.current) return;
    busy.current = true;
    (async () => {
      let last = -1;
      while (engine.current && last !== target.current) {
        last = target.current;
        await engine.current.seek(last);
      }
      busy.current = false;
    })();
  }, [progress, ready]);

  return (
    <div ref={box} className="size-full overflow-hidden bg-[#0b0b0c]">
      <div ref={host} className="origin-top-left p-[2%]" />
    </div>
  );
}
