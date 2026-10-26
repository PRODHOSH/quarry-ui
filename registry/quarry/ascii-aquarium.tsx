"use client";

import { useEffect, useRef, type ReactNode, type RefObject } from "react";
import { cn } from "@/lib/utils";

export type Animal = "shark" | "hammerhead" | "manta" | "whale" | "turtle" | "jellyfish" | "school" | "birds" | "butterflies" | "dog" | "cat" | "rabbit" | "pets";
export type Colorway = "theme" | "abyss" | "mono" | "ember" | "kelp" | "dusk" | "paper";
type Pointer = "avoid" | "attract" | "off";

type RGB = [number, number, number];
type Pt = { x: number; y: number };
type Palette = { bg: RGB; tile: RGB; ink: RGB; fam: [RGB, RGB, RGB]; hi: RGB; lo: RGB };

type Swatch = { label: string; bg: string; tile: string; ink: string; fam: [string, string, string]; hi: string; lo: string };

/** Ready made colourways. `theme` is separate: it reads your own background, foreground and primary tokens. */
export const COLORWAYS: Record<Exclude<Colorway, "theme">, Swatch> = {
  abyss: { label: "Abyss", bg: "#070b12", tile: "#101823", ink: "#cfe3ff", fam: ["#6a8fd0", "#5bb5ba", "#9096c0"], hi: "#050a10", lo: "#d4e4fb" },
  mono: { label: "Mono", bg: "#0a0a0a", tile: "#161616", ink: "#e5e5e5", fam: ["#dcdcdc", "#a8a8a8", "#7e7e7e"], hi: "#0a0a0a", lo: "#e8e8e8" },
  ember: { label: "Ember", bg: "#0d0908", tile: "#1a1211", ink: "#f3d9c8", fam: ["#e8764d", "#dba35e", "#c75a52"], hi: "#120a07", lo: "#f3d9c8" },
  kelp: { label: "Kelp", bg: "#080d0a", tile: "#111a13", ink: "#d6e8d3", fam: ["#80b48c", "#bcb872", "#52a092"], hi: "#07100a", lo: "#d6e8d3" },
  dusk: { label: "Dusk", bg: "#0c0a14", tile: "#161324", ink: "#e2dcff", fam: ["#9d8ff2", "#e78db2", "#72a3ee"], hi: "#0b0817", lo: "#e2dcff" },
  paper: { label: "Paper", bg: "#f1efe9", tile: "#e3e0d7", ink: "#1c2030", fam: ["#3f4f84", "#6b6a41", "#1f6671"], hi: "#f6f4ee", lo: "#1c2030" },
};

export const ANIMALS: { id: Animal; label: string; group: "Ocean" | "Sky" | "Land" }[] = [
  { id: "shark", label: "Shark", group: "Ocean" },
  { id: "hammerhead", label: "Hammerhead", group: "Ocean" },
  { id: "manta", label: "Manta", group: "Ocean" },
  { id: "whale", label: "Whale", group: "Ocean" },
  { id: "turtle", label: "Turtle", group: "Ocean" },
  { id: "jellyfish", label: "Jellyfish", group: "Ocean" },
  { id: "school", label: "Sardines", group: "Ocean" },
  { id: "birds", label: "Birds", group: "Sky" },
  { id: "butterflies", label: "Butterflies", group: "Sky" },
  { id: "dog", label: "Dog", group: "Land" },
  { id: "cat", label: "Cat", group: "Land" },
  { id: "rabbit", label: "Rabbit", group: "Land" },
  { id: "pets", label: "Pets", group: "Land" },
];

type Kind = "dog" | "cat" | "rabbit";
const WALKERS: Animal[] = ["dog", "cat", "rabbit", "pets"];
const PIXEL_ANIMALS: Animal[] = [...WALKERS, "birds", "butterflies", "school"];

const FONT = `ui-monospace, "SF Mono", "Cascadia Mono", Menlo, Consolas, monospace`;
const RAMP = " .:-=+*#%@";
const LEVELS = 6;
const SPINE = 24;
const TAU = Math.PI * 2;

const DEFAULT_COUNT: Record<Animal, number> = { shark: 3, hammerhead: 2, manta: 2, whale: 2, turtle: 2, jellyfish: 5, school: 44, birds: 9, butterflies: 7, dog: 2, cat: 2, rabbit: 3, pets: 3 };
/** Cruise speed in px per second and how fast it can turn in rad per second. */
const SWIM: Record<"shark" | "hammerhead" | "manta" | "whale" | "turtle", { speed: number; turn: number; len: number }> = {
  shark: { speed: 50, turn: 0.28, len: 1 },
  hammerhead: { speed: 44, turn: 0.26, len: 0.95 },
  manta: { speed: 38, turn: 0.26, len: 0.9 },
  whale: { speed: 24, turn: 0.17, len: 1.45 },
  turtle: { speed: 20, turn: 0.22, len: 0.55 },
};
const isSwimmer = (a: Animal) => a in SWIM;

const clamp = (v: number, lo: number, hi: number) => (v < lo ? lo : v > hi ? hi : v);
const smooth = (a: number, b: number, x: number) => {
  const t = clamp((x - a) / (b - a), 0, 1);
  return t * t * (3 - 2 * t);
};
const angleDiff = (a: number, b: number) => Math.atan2(Math.sin(a - b), Math.cos(a - b));
const hex = (h: string): RGB => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
const css = (c: RGB) => `rgb(${Math.round(c[0])},${Math.round(c[1])},${Math.round(c[2])})`;
const rnd = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

/** Turn any CSS colour, including oklch and var(--token), into [r, g, b]. */
function toRgb(host: HTMLElement, value: string): RGB {
  const probe = document.createElement("span");
  probe.style.color = value;
  host.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.fillStyle = resolved;
  x.fillRect(0, 0, 1, 1);
  const d = x.getImageData(0, 0, 1, 1).data;
  return [d[0], d[1], d[2]];
}

function paletteOf(host: HTMLElement, key: Colorway): Palette {
  if (key !== "theme") {
    const s = COLORWAYS[key];
    return { bg: hex(s.bg), tile: hex(s.tile), ink: hex(s.ink), fam: [hex(s.fam[0]), hex(s.fam[1]), hex(s.fam[2])], hi: hex(s.hi), lo: hex(s.lo) };
  }
  const bg = toRgb(host, "var(--background)");
  const fg = toRgb(host, "var(--foreground)");
  const primary = toRgb(host, "var(--primary)");
  return {
    bg,
    tile: mix(bg, fg, 0.08),
    ink: fg,
    fam: [primary, mix(primary, fg, 0.5), mix(primary, bg, 0.35)],
    hi: bg,
    lo: fg,
  };
}

/** Tone and colour family travel together through one pixel: red is the tone, green is the tone times family / 2. */
function setTone(c: CanvasRenderingContext2D, t: number, fam: number, stroke = false) {
  const v = Math.round(clamp(t, 0, 1) * 255);
  const style = `rgb(${v},${Math.round((v * fam) / 2)},0)`;
  if (stroke) c.strokeStyle = style;
  else c.fillStyle = style;
}

function ribbon(c: CanvasRenderingContext2D, pts: Pt[], nrm: Pt[], w: (i: number) => number, k: number) {
  c.beginPath();
  for (let i = 0; i < pts.length; i++) c.lineTo(pts[i].x + nrm[i].x * w(i) * k, pts[i].y + nrm[i].y * w(i) * k);
  for (let i = pts.length - 1; i >= 0; i--) c.lineTo(pts[i].x - nrm[i].x * w(i) * k, pts[i].y - nrm[i].y * w(i) * k);
  c.closePath();
  c.fill();
}

function tri(c: CanvasRenderingContext2D, a: Pt, b: Pt, d: Pt) {
  c.beginPath();
  c.moveTo(a.x, a.y);
  c.lineTo(b.x, b.y);
  c.lineTo(d.x, d.y);
  c.closePath();
  c.fill();
}

const sharkW = (s: number) => {
  if (s < 0.2) return 0.092 * Math.pow(Math.sin(((s / 0.2) * Math.PI) / 2), 0.9);
  if (s < 0.34) return 0.092 + 0.016 * smooth(0.2, 0.34, s);
  if (s < 0.84) return 0.019 + 0.089 * Math.pow(1 - (s - 0.34) / 0.5, 1.3);
  const k = (s - 0.84) / 0.16;
  return 0.019 * (1 - k) + 0.012 * Math.sin(k * Math.PI) + 0.002;
};
const whaleW = (s: number) => {
  if (s < 0.2) return 0.082 * Math.pow(Math.sin(((s / 0.2) * Math.PI) / 2), 0.75);
  if (s < 0.55) return 0.082 + 0.008 * Math.sin(((s - 0.2) / 0.35) * Math.PI);
  if (s < 0.95) return 0.082 * Math.pow(1 - (s - 0.55) / 0.4, 1.15) + 0.012;
  return 0.012;
};

type Swimmer = { x: number; y: number; heading: number; size: number; fam: number; phase: number; trail: Pt[] };
type Jelly = { x: number; y: number; vx: number; vy: number; size: number; fam: number; phase: number; rate: number; tilt: number };
type Fish = { x: number; y: number; vx: number; vy: number; fam: number; phase: number };
type Bubble = { x: number; y: number; v: number; ph: number };
type Flutter = { x: number; y: number; vx: number; vy: number; fam: number; phase: number; size: number };
type Walker = { kind: Kind; x: number; startX: number; targetX: number; t: number; dur: number; hops: number; wait: number; flip: 1 | -1; phase: number; fam: number; lane: number };
/**
 * Pets are pixel art, one sprite pixel per character cell. Legend: o outline, b base, d shade, l light,
 * w white, k dark (eyes, nose), p and a accents in the second colour. Every sprite is 20 pixels wide and faces the viewer.
 */
type Layer = { x: number; y: number; rows: string[] };
type Sprite = { rows: string[]; tails: Layer[]; blink: Layer[] };
const SHADE: Record<string, [number, number]> = { o: [0.26, 0], b: [0.6, 0], d: [0.42, 0], l: [0.82, 0], w: [0.95, 0], k: [0.12, 0], p: [0.74, 1], a: [0.5, 1] };
const SPRITE_W = 20;

const PIXELS = {
  fish: [
    ["..oooo...", "o.obbbbo.", "ooobbbwko", "o.obbbbo.", "..oooo..."],
    ["o.oooo...", ".oobbbbo.", "ooobbbwko", ".oobbbbo.", "o.oooo..."],
  ],
  bird: [
    ["o.........o", "oo.......oo", ".obo...obo.", "..obbobbo..", "...oowoo..."],
    ["..ooooooo..", ".obbbbbbbo.", "obo.owo.obo", "oo.......oo", "o.........o"],
  ],
  butterfly: [
    ["..o...o..", "...o.o...", "ooo.k.ooo", "obbokobbo", "obpbkbpbo", ".obokobo.", "..ookoo.."],
    ["..o...o..", "...o.o...", "...obo...", "...obo...", "...oko...", "...obo...", "....o...."],
  ],
};

const SPRITES: Record<Kind, Sprite> = {
  cat: {
    rows: [
      "..o..............o..",
      "..oo............oo..",
      "..oboo........oobo..",
      "..obbboooooooobbbo..",
      ".obbbbbbbbbbbbbbbbo.",
      ".obbbbbbbbbbbbbbbbo.",
      ".obbwkbbbbbbbbwkbbo.",
      ".obbkkbbbbbbbbkkbbo.",
      ".obbbbbbbbbbbbbbbbo.",
      ".obbbbbbbppbbbbbbbo.",
      ".obbbbbllllllbbbbbo.",
      ".obbbbbbbbbbbbbbbbo.",
      "..obbbbbbbbbbbbbbo..",
      "...oobbbbbbbbbboo...",
      "....obbbbbbbbbbo....",
      "...obbbbbbbbbbbbo...",
      "...obbbbllllbbbbo...",
      "..obbbbbllllbbbbbo..",
      "..obbbbbllllbbbbbo..",
      "..obbbbbllllbbbbbo..",
      "..obbbbbbddbbbbbbo..",
      "..obbbbwwddwwbbbbo..",
      "..oooooooooooooooo..",
    ],
    tails: [
      { x: 18, y: 12, rows: ["..oo.", ".obbo", ".obbo", ".obo.", "obbo.", "obbo.", "obbo.", "obbbo", ".obbo", ".ooo."] },
      { x: 18, y: 14, rows: ["...oo.", "..obbo", "..obbo", ".obbo.", "obbo..", "obbo..", "obbbo.", ".obbo.", "..ooo."] },
    ],
    blink: [
      { x: 4, y: 6, rows: ["bb", "oo"] },
      { x: 14, y: 6, rows: ["bb", "oo"] },
    ],
  },
  dog: {
    rows: [
      "....oooooooooooo....",
      "...obbbbbbbbbbbbo...",
      "..obbbbbbbbbbbbbbo..",
      ".oaabbbbbbbbbbbbaao.",
      ".oaabwkbbbbbbwkbaao.",
      ".oaabkkbbbbbbkkbaao.",
      ".oaabbbbbbbbbbbbaao.",
      ".oaabbbbllllbbbbaao.",
      ".oaabblllkklllbbaao.",
      "..oaabbllllllbbaao..",
      "...oobbllppllbboo...",
      ".....oobbbbbboo.....",
      "....obbbbbbbbbbo....",
      "...obbbbbbbbbbbbo...",
      "...obbbbllllbbbbo...",
      "..obbbbbllllbbbbbo..",
      "..obbbbbllllbbbbbo..",
      "..obbbbbllllbbbbbo..",
      "..obbbbbbddbbbbbbo..",
      "..obbbbwwddwwbbbbo..",
      "..oooooooooooooooo..",
    ],
    tails: [
      { x: 18, y: 12, rows: ["..oo.", ".obbo", ".obbo", ".obo.", "obbo.", "obbo.", "obbbo", ".ooo."] },
      { x: 18, y: 14, rows: ["....oo", "...obo", "..obbo", "..obbo", ".obbo.", "obbbo.", ".obbo.", "..ooo."] },
    ],
    blink: [
      { x: 5, y: 4, rows: ["bb", "oo"] },
      { x: 13, y: 4, rows: ["bb", "oo"] },
    ],
  },
  rabbit: {
    rows: [
      ".....oo......oo.....",
      "....obbo....obbo....",
      "....oppo....oppo....",
      "....oppo....oppo....",
      "....oppo....oppo....",
      "....oppo....oppo....",
      "....obbo....obbo....",
      "...obbbo....obbbo...",
      "..obbbbbbbbbbbbbbo..",
      ".obbbbbbbbbbbbbbbbo.",
      ".obbbkbbbbbbbbkbbbo.",
      ".obbbkbbbbbbbbkbbbo.",
      ".obbbbbbbppbbbbbbbo.",
      ".obbbbbbllllbbbbbbo.",
      "..obbbbbbbbbbbbbbo..",
      "...oobbbbbbbbbboo...",
      "...obbbbbbbbbbbbo...",
      "..obbbbbllllbbbbbo..",
      ".obbbbbbllllbbbbbbo.",
      ".obbbbbbllllbbbbbbo.",
      ".obbbbbbbbbbbbbbbbo.",
      ".obbbbbwwddwwbbbbbo.",
      ".oooooooooooooooooo.",
    ],
    tails: [
      { x: 18, y: 17, rows: [".oo.", "owwo", "owwo", ".oo."] },
      { x: 18, y: 17, rows: [".oo.", "owwo", "owwo", ".oo."] },
    ],
    blink: [
      { x: 5, y: 10, rows: ["b", "o"] },
      { x: 14, y: 10, rows: ["b", "o"] },
    ],
  },
};

type Tree = { x: number; h: number; pine: boolean; phase: number; fam: number };

/**
 * Sea creatures drawn as ASCII. Every frame the animals are painted as soft shapes into a tiny
 * off screen canvas, one pixel per character cell, and each pixel is turned into a glyph by how
 * dark it is. Sharks, a hammerhead, manta, whale, jellyfish and a school of sardines, in a handful
 * of colourways (or your own theme tokens). Animals steer around the content and the cursor.
 */
export function AsciiAquarium({
  animal = "shark",
  colorway = "theme",
  count,
  speed = 1,
  scale = 1,
  detail = 9,
  look = "auto",
  grid = true,
  bubbles = true,
  pointer = "avoid",
  paused = false,
  calm = 0.6,
  dim = 0,
  avoid,
  children,
  className,
}: {
  animal?: Animal;
  colorway?: Colorway;
  /** How many animals. Leave empty for a good default per animal. */
  count?: number;
  speed?: number;
  /** Size of the animals. */
  scale?: number;
  /** Size of one character cell in px. Smaller is finer. */
  detail?: number;
  /** Tiles paint a muted square behind every glyph, glyphs draw plain text. Auto picks what suits the animal. */
  look?: "auto" | "tiles" | "glyphs";
  /** Faint cell grid behind everything. Only with tiles. */
  grid?: boolean;
  bubbles?: boolean;
  pointer?: Pointer;
  paused?: boolean;
  /** How much the scene fades behind your content, 0 to 1. */
  calm?: number;
  /** Fades the whole scene, 0 to 1. Handy behind long text. */
  dim?: number;
  /** Element the animals should keep clear of. Defaults to the children. */
  avoid?: RefObject<HTMLElement | null>;
  children?: ReactNode;
  className?: string;
}) {
  const tiles = look === "auto" ? PIXEL_ANIMALS.includes(animal) : look === "tiles";
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const live = useRef({ colorway, speed, scale, pointer, paused, calm, dim, bubbles });

  useEffect(() => {
    live.current = { colorway, speed, scale, pointer, paused, calm, dim, bubbles };
  });

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const ctx = cv.getContext("2d")!;
    const off = document.createElement("canvas");
    const octx = off.getContext("2d", { willReadFrequently: true })!;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const cellW = tiles ? detail : detail * 0.6;
    const cellH = detail;
    const fontPx = tiles ? detail * 0.8 : detail * 0.95;
    let total = count ?? DEFAULT_COUNT[animal];

    let W = 0;
    let H = 0;
    let cols = 1;
    let rows = 1;
    let clock = 0;
    let raf = 0;
    let last = 0;
    let visible = true;
    let seeded = false;
    let dirty = true;
    let palKey: Colorway = live.current.colorway;
    let pal = paletteOf(el, palKey);
    let tileCss: string[] = [];
    let glyphCss: string[] = [];
    let sig = "";
    let rect: [number, number, number, number] | null = null;
    const ptr = { x: -1e4, y: -1e4, on: false };

    let swimmers: Swimmer[] = [];
    let jellies: Jelly[] = [];
    let fish: Fish[] = [];
    let flutters: Flutter[] = [];
    let walkers: Walker[] = [];
    let trees: Tree[] = [];
    let bubs: Bubble[] = [];
    const buckets: number[][] = Array.from({ length: 3 * LEVELS }, () => []);

    const colors = () => {
      tileCss = [];
      glyphCss = [];
      for (let f = 0; f < 3; f++) {
        for (let l = 1; l <= LEVELS; l++) {
          const t = l / LEVELS;
          tileCss.push(css(mix(pal.tile, pal.fam[f], clamp(t * 1.05, 0, 1))));
          glyphCss.push(tiles ? css(t > 0.5 ? pal.hi : pal.lo) : css(mix(pal.bg, pal.fam[f], 0.3 + 0.7 * t)));
        }
      }
    };
    colors();

    /** Body length of the biggest animal, from the size of the stage. */
    const base = () => clamp(Math.min(W, H) * 0.64, 200, 470) * live.current.scale;
    const lenOf = (s: Swimmer) => base() * SWIM[animal as keyof typeof SWIM].len * s.size;

    const ground = () => H * 0.86;

    const seed = () => {
      seeded = true;
      if (count === undefined && (isSwimmer(animal) || animal === "jellyfish")) {
        total = clamp(Math.round((W * H) / (base() * base() * (animal === "jellyfish" ? 1.1 : isSwimmer(animal) && SWIM[animal as keyof typeof SWIM].len < 0.6 ? 1.2 : 2.4))), 1, DEFAULT_COUNT[animal]);
      }
      swimmers = [];
      jellies = [];
      fish = [];
      flutters = [];
      walkers = [];
      trees = [];
      if (animal === "jellyfish") {
        jellies = Array.from({ length: total }, (_, i) => ({
          x: ((i + 0.5) / total) * W * 0.9 + W * 0.05,
          y: H * (0.2 + 0.7 * rnd(i + 3)),
          vx: 0,
          vy: 0,
          size: 1 - (i % 3) * 0.22 - (i === 0 ? 0 : 0.05),
          fam: i % 3,
          phase: rnd(i + 9) * TAU,
          rate: 0.5 + rnd(i + 5) * 0.18,
          tilt: 0,
        }));
      } else if (animal === "school" || animal === "birds") {
        const bird = animal === "birds";
        fish = Array.from({ length: total }, (_, i) => {
          const g = i % 3;
          const cx = W * (0.28 + 0.22 * g);
          const cy = H * (0.35 + 0.15 * ((g * 2) % 3));
          const a = rnd(i + 1) * TAU;
          return { x: cx + Math.cos(a) * rnd(i + 7) * 90, y: cy + Math.sin(a) * rnd(i + 11) * 70, vx: (bird ? 90 : 60) + rnd(i) * 20, vy: (rnd(i + 2) - 0.5) * 20, fam: bird ? 0 : g, phase: rnd(i + 4) * TAU };
        });
      } else if (animal === "butterflies") {
        flutters = Array.from({ length: total }, (_, i) => ({
          x: W * (0.1 + 0.8 * rnd(i + 2)),
          y: H * (0.15 + 0.6 * rnd(i + 8)),
          vx: 0,
          vy: 0,
          fam: i % 3,
          phase: rnd(i + 6) * TAU,
          size: 0.8 + rnd(i + 12) * 0.5,
        }));
      } else if (WALKERS.includes(animal)) {
        const kinds: Kind[] = animal === "pets" ? ["dog", "cat", "rabbit"] : [animal as Kind];
        total = Math.max(1, Math.min(total, Math.floor((W * 0.7) / (spriteScale() * cellW * SPRITE_W))));
        walkers = Array.from({ length: total }, (_, i) => {
          const kind = kinds[i % kinds.length];
          const x = W * (0.24 + (0.52 * (i + 0.5)) / total);
          return { kind, x, startX: x, targetX: x, t: 1, dur: 1, hops: 1, wait: 1 + i * 1.3, flip: i % 2 ? -1 : 1, phase: rnd(i + 7) * 6, fam: animal === "pets" ? i % 3 : (i * 2) % 3, lane: 0 };
        });
        const nt = clamp(Math.round(W / (base() * 0.9)) * 2, 4, 8);
        trees = Array.from({ length: nt }, (_, i) => ({
          x: i % 2 ? W * (1 - 0.05 - Math.floor(i / 2) * 0.1 - rnd(i + 31) * 0.03) : W * (0.05 + Math.floor(i / 2) * 0.1 + rnd(i + 31) * 0.03),
          h: base() * (0.36 + rnd(i + 17) * 0.34),
          pine: i % 3 !== 1,
          phase: rnd(i + 13) * TAU,
          fam: 1 + (i % 2),
        }));
      } else {
        swimmers = Array.from({ length: total }, (_, i) => {
          const heading = i % 2 ? Math.PI + 0.3 + i * 0.4 : 0.2 + i * 0.5;
          const s: Swimmer = {
            x: W * (0.22 + ((i * 0.37) % 0.6)),
            y: H * (0.2 + ((i * 0.41) % 0.62)),
            heading,
            size: Math.max(0.45, 1 - i * 0.22),
            fam: i % 3,
            phase: i * 2.1,
            trail: [],
          };
          const L = lenOf(s);
          for (let d = 0; d <= L * 1.2; d += 3) s.trail.push({ x: s.x - Math.cos(heading) * d, y: s.y - Math.sin(heading) * d });
          return s;
        });
      }
      const n = clamp(Math.round((cols * rows) / 900), 6, 40);
      bubs = Array.from({ length: n }, (_, i) => ({ x: rnd(i + 21) * W, y: rnd(i + 31) * H, v: 8 + rnd(i + 41) * 16, ph: rnd(i + 51) * TAU }));
    };

    const readRect = () => {
      const t = avoid?.current ?? content.current;
      if (!t) {
        rect = null;
        return;
      }
      const h = el.getBoundingClientRect();
      const r = t.getBoundingClientRect();
      rect = [r.left - h.left, r.top - h.top, r.right - h.left, r.bottom - h.top];
    };

    /** Push a heading away from (or toward) the pointer and the content block. */
    const pull = (x: number, y: number, size: number, out: Pt) => {
      if (rect) {
        const cx = (rect[0] + rect[2]) / 2;
        const cy = (rect[1] + rect[3]) / 2;
        const hw = (rect[2] - rect[0]) / 2 + 80 * size;
        const hh = (rect[3] - rect[1]) / 2 + 60 * size;
        const nx = (x - cx) / hw;
        const ny = (y - cy) / hh;
        if (Math.abs(nx) < 1 && Math.abs(ny) < 1) {
          const depth = 1 - Math.max(Math.abs(nx), Math.abs(ny));
          const n = Math.hypot(nx, ny) || 1;
          out.x += (nx / n) * (1 + depth * 2.5);
          out.y += (ny / n) * (1 + depth * 2.5);
        }
      }
      const mode = live.current.pointer;
      if (ptr.on && mode !== "off") {
        const dx = x - ptr.x;
        const dy = y - ptr.y;
        const d = Math.hypot(dx, dy) || 1;
        if (mode === "avoid" && d < 180) {
          out.x += (dx / d) * (1 - d / 180) * 2.6;
          out.y += (dy / d) * (1 - d / 180) * 2.6;
        } else if (mode === "attract" && d < 420) {
          const k = d < 90 ? -(1 - d / 90) * 2 : (1 - d / 420) * 1.1;
          out.x -= (dx / d) * k;
          out.y -= (dy / d) * k;
        }
      }
    };

    const stepSwimmers = (dt: number) => {
      const cfg = SWIM[animal as keyof typeof SWIM];
      const m = Math.min(W, H) * 0.12;
      const v: Pt = { x: 0, y: 0 };
      for (const s of swimmers) {
        const wander = 0.4 * Math.sin(clock * 0.35 + s.phase);
        v.x = Math.cos(s.heading + wander);
        v.y = Math.sin(s.heading + wander);
        if (s.x < m) v.x += ((m - s.x) / m) * 2.2;
        if (s.x > W - m) v.x -= ((s.x - (W - m)) / m) * 2.2;
        if (s.y < m) v.y += ((m - s.y) / m) * 2.2;
        if (s.y > H - m) v.y -= ((s.y - (H - m)) / m) * 2.2;
        pull(s.x, s.y, s.size, v);
        for (const o of swimmers) {
          if (o === s) continue;
          const ox = s.x - o.x;
          const oy = s.y - o.y;
          const d = Math.hypot(ox, oy) || 1;
          const reach = (lenOf(s) + lenOf(o)) * 0.55;
          if (d < reach) {
            v.x += (ox / d) * (1 - d / reach) * 2.4;
            v.y += (oy / d) * (1 - d / reach) * 2.4;
          }
        }
        s.heading += clamp(angleDiff(Math.atan2(v.y, v.x), s.heading) * 1.6, -cfg.turn, cfg.turn) * dt;
        s.x += Math.cos(s.heading) * cfg.speed * dt;
        s.y += Math.sin(s.heading) * cfg.speed * dt;
        const head = s.trail[0];
        if (!head || Math.hypot(s.x - head.x, s.y - head.y) >= 3) {
          s.trail.unshift({ x: s.x, y: s.y });
          if (s.trail.length > 700) s.trail.pop();
        }
      }
    };

    const stepJellies = (dt: number) => {
      const L = base();
      const v: Pt = { x: 0, y: 0 };
      for (const j of jellies) {
        j.phase += dt * TAU * j.rate;
        const kick = Math.max(0, Math.cos(j.phase));
        const targetVy = -kick * kick * 125 * j.size + 11;
        j.vy += (targetVy - j.vy) * Math.min(1, dt * 3);
        const flow = Math.sin(j.y * 0.006 + clock * 0.15 + j.phase) * 14;
        v.x = 0;
        v.y = 0;
        pull(j.x, j.y, j.size * 1.6, v);
        j.vx += ((flow + v.x * 70) - j.vx) * Math.min(1, dt * 0.9);
        if (j.x < L * 0.2) j.vx += 30 * dt;
        if (j.x > W - L * 0.2) j.vx -= 30 * dt;
        j.x += j.vx * dt;
        j.y += (j.vy + v.y * 18) * dt;
        j.tilt += (clamp(j.vx / 90, -0.35, 0.35) - j.tilt) * Math.min(1, dt * 2);
        if (j.y < -L * 0.55) {
          j.y = H + L * 0.45;
          j.x = W * (0.08 + 0.84 * rnd(clock + j.phase));
        }
      }
    };

    const stepFish = (dt: number) => {
      const n = fish.length;
      const v: Pt = { x: 0, y: 0 };
      const bird = animal === "birds";
      const R = bird ? 200 : 120;
      const SEP = bird ? 130 : 72;
      const tx = W * (0.5 + 0.34 * Math.sin(clock * 0.11));
      const ty = H * (0.42 + 0.22 * Math.sin(clock * 0.17 + 1));
      for (let i = 0; i < n; i++) {
        const f = fish[i];
        let sx = 0;
        let sy = 0;
        let ax = 0;
        let ay = 0;
        let cx = 0;
        let cy = 0;
        let k = 0;
        for (let j = 0; j < n; j++) {
          if (i === j) continue;
          const o = fish[j];
          const dx = f.x - o.x;
          const dy = f.y - o.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > R * R) continue;
          k++;
          ax += o.vx;
          ay += o.vy;
          cx += o.x;
          cy += o.y;
          if (d2 < SEP * SEP) {
            const d = Math.sqrt(d2) || 1;
            sx += (dx / d) * (1 - d / SEP);
            sy += (dy / d) * (1 - d / SEP);
          }
        }
        let fx = sx * 320;
        let fy = sy * 320;
        if (k) {
          fx += (ax / k - f.vx) * 1.4 + (cx / k - f.x) * 0.18;
          fy += (ay / k - f.vy) * 1.4 + (cy / k - f.y) * 0.18;
        }
        if (bird) {
          fx += (tx - f.x) * 0.22;
          fy += (ty - f.y) * 0.22;
        } else {
          fx += Math.sin(f.y * 0.008 + clock * 0.2) * 26;
          fy += Math.cos(f.x * 0.007 - clock * 0.17) * 22;
        }
        const m = 70;
        if (f.x < m) fx += (m - f.x) * 2.4;
        if (f.x > W - m) fx -= (f.x - (W - m)) * 2.4;
        if (f.y < m) fy += (m - f.y) * 2.4;
        if (f.y > H - m) fy -= (f.y - (H - m)) * 2.4;
        v.x = 0;
        v.y = 0;
        pull(f.x, f.y, 0.5, v);
        fx += v.x * 150;
        fy += v.y * 150;
        f.vx += fx * dt;
        f.vy += fy * dt;
        const sp = Math.hypot(f.vx, f.vy) || 1;
        const t = clamp(sp, bird ? 78 : 46, bird ? 126 : 96);
        f.vx = (f.vx / sp) * t;
        f.vy = (f.vy / sp) * t;
        f.x += f.vx * dt;
        f.y += f.vy * dt;
      }
    };

    const stepFlutters = (dt: number) => {
      const v: Pt = { x: 0, y: 0 };
      for (const f of flutters) {
        const tx = Math.sin(clock * 0.8 + f.phase * 3) * 38 + Math.sin(clock * 2.1 + f.phase) * 24;
        const ty = Math.cos(clock * 0.7 + f.phase * 2) * 30 + Math.sin(clock * 1.9 + f.phase * 5) * 22 - 6;
        v.x = 0;
        v.y = 0;
        pull(f.x, f.y, 0.7, v);
        let ax = tx + v.x * 90;
        let ay = ty + v.y * 90;
        const m = 80;
        if (f.x < m) ax += (m - f.x) * 1.5;
        if (f.x > W - m) ax -= (f.x - (W - m)) * 1.5;
        if (f.y < m) ay += (m - f.y) * 1.5;
        if (f.y > H * 0.82) ay -= (f.y - H * 0.82) * 1.5;
        f.vx += (ax - f.vx) * Math.min(1, dt * 1.6);
        f.vy += (ay - f.vy) * Math.min(1, dt * 1.6);
        f.x += f.vx * dt;
        f.y += f.vy * dt;
      }
    };

    const stepBubbles = (dt: number) => {
      for (const b of bubs) {
        b.y -= b.v * dt;
        b.x += Math.sin(clock * 0.8 + b.ph) * 4 * dt;
        if (b.y < -10) {
          b.y = H + 10;
          b.x = rnd(clock + b.ph) * W;
        }
      }
    };

    const step = (dt: number) => {
      clock += dt;
      readRect();
      if (animal === "jellyfish") stepJellies(dt);
      else if (animal === "school" || animal === "birds") stepFish(dt);
      else if (animal === "butterflies") stepFlutters(dt);
      else if (WALKERS.includes(animal)) stepPets(dt);
      else stepSwimmers(dt);
      stepBubbles(dt);
    };

    /** Spine points head to tail, evenly spaced along the path the head swam. */
    const spineOf = (s: Swimmer, len: number) => {
      const seg = len / (SPINE - 1);
      const pts: Pt[] = [{ x: s.x, y: s.y }];
      let prev = pts[0];
      let acc = 0;
      for (let k = 0; k < s.trail.length && pts.length < SPINE; k++) {
        const p = s.trail[k];
        acc += Math.hypot(p.x - prev.x, p.y - prev.y);
        if (acc >= seg) {
          pts.push(p);
          acc = 0;
        }
        prev = p;
      }
      while (pts.length < SPINE) {
        const a = pts[pts.length - 1];
        pts.push({ x: a.x - Math.cos(s.heading) * seg, y: a.y - Math.sin(s.heading) * seg });
      }
      return pts;
    };

    const frame = (pts: Pt[], i: number) => {
      const a = pts[Math.max(0, i - 1)];
      const b = pts[Math.min(pts.length - 1, i + 1)];
      const dx = b.x - a.x;
      const dy = b.y - a.y;
      const n = Math.hypot(dx, dy) || 1;
      return { dir: { x: dx / n, y: dy / n }, nrm: { x: -dy / n, y: dx / n } };
    };

    const stillOrNot = () => (reduced.matches ? 0 : 1);

    const drawBody = (c: CanvasRenderingContext2D, s: Swimmer, L: number) => {
      const raw = spineOf(s, L);
      const beat = stillOrNot();
      const amp = animal === "whale" ? 0.035 : 0.05;
      const freq = animal === "whale" ? 1.4 : 3;
      const spine = raw.map((p, i) => {
        const { dir } = frame(raw, i);
        const off = beat * L * amp * Math.pow(i / (SPINE - 1), 1.3) * Math.sin(clock * freq - i * 0.5 + s.phase);
        return { x: p.x - dir.y * off, y: p.y + dir.x * off };
      });
      const fr = spine.map((_, i) => frame(spine, i));
      const nrm = fr.map((f) => f.nrm);
      const profile = animal === "whale" ? whaleW : sharkW;
      const wAt = (i: number) => {
        const sx = i / (SPINE - 1);
        const w = profile(sx) * L;
        if (animal === "hammerhead" && sx < 0.16) return Math.max(w * 0.7, 1.5);
        return Math.max(w, 1.5);
      };
      const at = (i: number, side: number, out: number, back: number): Pt => ({
        x: spine[i].x + nrm[i].x * side * out + fr[i].dir.x * back,
        y: spine[i].y + nrm[i].y * side * out + fr[i].dir.y * back,
      });

      // Fins and tail go first, so the body sits on top of them.
      setTone(c, 0.52, s.fam);
      const root = animal === "whale" ? 7 : 5;
      for (const side of [1, -1]) {
        const reach = animal === "whale" ? 0.17 : 0.085;
        tri(c, at(root - 1, side, wAt(root - 1) * 0.7, 0), at(root + 2, side, wAt(root + 2) * 0.7, 0), at(root, side, wAt(root) + reach * L, (animal === "whale" ? 0.09 : 0.2) * L));
      }
      if (animal === "shark" || animal === "hammerhead") {
        for (const side of [1, -1]) tri(c, at(15, side, wAt(15) * 0.5, 0), at(17, side, wAt(17) * 0.5, 0), at(16, side, wAt(16) + 0.055 * L, 0.05 * L));
        const t = SPINE - 1;
        tri(c, at(t - 2, 1, wAt(t - 2), 0), at(t, -1, 0.01 * L, 0), at(t, 1, 0.1 * L, 0.2 * L));
        tri(c, at(t - 2, -1, wAt(t - 2), 0), at(t, 1, 0.01 * L, 0), at(t, -1, 0.075 * L, 0.14 * L));
      } else {
        const t = SPINE - 1;
        for (const side of [1, -1]) tri(c, at(t - 1, side, 0.01 * L, 0), at(t, side, 0.01 * L, 0), at(t, side, 0.15 * L, 0.07 * L));
        tri(c, at(t, 1, 0.01 * L, 0), at(t, -1, 0.01 * L, 0), at(t, 0, 0, 0.04 * L));
      }

      for (const [k, t] of [[1, 0.4], [0.72, 0.58], [0.46, 0.76], [0.2, 0.9]] as const) {
        setTone(c, t, s.fam);
        ribbon(c, spine, nrm, wAt, k);
      }

      if (animal === "hammerhead") {
        const h = spine[1];
        const f = fr[1];
        const half = 0.14 * L;
        for (const [k, t] of [[1, 0.46], [0.6, 0.66]] as const) {
          setTone(c, t, s.fam);
          c.beginPath();
          c.ellipse(h.x, h.y, 0.05 * L * k, half * k, Math.atan2(f.dir.y, f.dir.x), 0, TAU);
          c.fill();
        }
        setTone(c, 0.98, s.fam);
        for (const side of [1, -1]) {
          c.beginPath();
          c.arc(h.x + f.nrm.x * side * half * 0.88, h.y + f.nrm.y * side * half * 0.88, Math.max(cellW * 0.6, L * 0.011), 0, TAU);
          c.fill();
        }
      }
    };

    const drawManta = (c: CanvasRenderingContext2D, s: Swimmer, L: number) => {
      const fx = Math.cos(s.heading);
      const fy = Math.sin(s.heading);
      const nx = -fy;
      const ny = fx;
      const flap = stillOrNot() * Math.sin(clock * 1.7 + s.phase);
      const world = (a: number, b: number): Pt => ({ x: s.x - fx * a * L + nx * b * L, y: s.y - fy * a * L + ny * b * L });
      // Half of the outline as [back from nose, out from centre], in body lengths. Smoothed below.
      const half: [number, number][] = [[0, 0], [0.03, 0.07], [0.09, 0.2], [0.18, 0.37], [0.29, 0.5], [0.36, 0.45], [0.37, 0.3], [0.41, 0.14], [0.5, 0.03]];
      const outline = (k: number) => {
        const squash = 1 - 0.1 * (0.5 + 0.5 * flap);
        const raw = half.map(([a0, b0]) => {
          const tip = clamp(b0 / 0.5, 0, 1);
          return [a0 + flap * 0.07 * tip * tip, b0 * squash] as [number, number];
        });
        let pts = raw;
        for (let it = 0; it < 2; it++) {
          const next: [number, number][] = [pts[0]];
          for (let i = 0; i < pts.length - 1; i++) {
            const p = pts[i];
            const q = pts[i + 1];
            next.push([p[0] * 0.75 + q[0] * 0.25, p[1] * 0.75 + q[1] * 0.25], [p[0] * 0.25 + q[0] * 0.75, p[1] * 0.25 + q[1] * 0.75]);
          }
          next.push(pts[pts.length - 1]);
          pts = next;
        }
        const at = (a0: number, b0: number) => world(0.2 + (a0 - 0.2) * k, b0 * k);
        return [...pts.map(([a0, b0]) => at(a0, b0)), ...[...pts].reverse().map(([a0, b0]) => at(a0, -b0))];
      };
      for (const [k, t] of [[1, 0.4], [0.7, 0.58], [0.42, 0.76], [0.2, 0.9]] as const) {
        setTone(c, t, s.fam);
        const poly = outline(k);
        c.beginPath();
        poly.forEach((p, i) => (i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)));
        c.closePath();
        c.fill();
      }
      // The long thin tail.
      setTone(c, 0.5, s.fam, true);
      c.lineWidth = Math.max(cellW * 0.7, L * 0.012);
      c.lineCap = "round";
      c.beginPath();
      const t0 = world(0.5, 0);
      c.moveTo(t0.x, t0.y);
      for (let i = 1; i <= 8; i++) {
        const p = world(0.5 + i * 0.09, Math.sin(clock * 1.7 - i * 0.7 + s.phase) * 0.02 * i * stillOrNot());
        c.lineTo(p.x, p.y);
      }
      c.stroke();
    };

    const drawJelly = (c: CanvasRenderingContext2D, j: Jelly, L: number) => {
      const R = L * 0.17 * j.size;
      const p = stillOrNot() * Math.sin(j.phase);
      const rx = R * (1 - 0.12 * p);
      const ry = R * (0.74 + 0.16 * p);
      const sway = stillOrNot();
      c.save();
      c.translate(j.x, j.y);
      c.rotate(j.tilt);
      c.lineCap = "round";
      c.lineJoin = "round";

      // Thin tentacles, behind everything.
      const n = 11;
      setTone(c, 0.34, j.fam, true);
      c.lineWidth = Math.max(cellW * 0.85, R * 0.03);
      for (let k = 0; k < n; k++) {
        const u = (k / (n - 1)) * 2 - 1;
        const len = R * (1.7 + 1.5 * rnd(k + j.phase * 0));
        c.beginPath();
        for (let s = 0; s <= 12; s++) {
          const q = s / 12;
          const x = u * rx * 0.88 + Math.sin(clock * 1.3 + k * 0.9 - q * 3.4) * R * 0.13 * q * sway;
          const y = ry * 0.12 + len * q;
          if (s) c.lineTo(x, y);
          else c.moveTo(x, y);
        }
        c.stroke();
      }
      // A few thick oral arms.
      setTone(c, 0.52, j.fam, true);
      c.lineWidth = Math.max(cellW * 1.5, R * 0.1);
      for (let k = 0; k < 4; k++) {
        const u = (k / 3) * 2 - 1;
        c.beginPath();
        for (let s = 0; s <= 10; s++) {
          const q = s / 10;
          const x = u * rx * 0.34 + Math.sin(clock * 1.1 + k * 1.7 - q * 3) * R * 0.1 * q * sway;
          const y = ry * 0.1 + R * 1.5 * q;
          if (s) c.lineTo(x, y);
          else c.moveTo(x, y);
        }
        c.stroke();
      }
      // The bell, drawn from the outside in.
      for (const [k, t] of [[1, 0.34], [0.8, 0.5], [0.56, 0.68], [0.3, 0.86]] as const) {
        setTone(c, t, j.fam);
        c.save();
        c.scale(k, k);
        c.beginPath();
        c.ellipse(0, 0, rx, ry, 0, Math.PI, TAU);
        c.quadraticCurveTo(0, ry * (0.5 - 0.2 * p), -rx, 0);
        c.closePath();
        c.fill();
        c.restore();
      }
      c.restore();
    };

    const drawTurtle = (c: CanvasRenderingContext2D, s: Swimmer, L: number) => {
      const paddle = stillOrNot() * Math.sin(clock * 1.5 + s.phase);
      c.save();
      c.translate(s.x, s.y);
      c.rotate(s.heading);
      const flipper = (x: number, y: number, len: number, wid: number, ang: number) => {
        c.save();
        c.translate(x, y);
        c.rotate(ang);
        c.beginPath();
        c.ellipse(len * 0.5, 0, len * 0.5, wid, 0, 0, TAU);
        c.fill();
        c.restore();
      };
      setTone(c, 0.5, s.fam);
      for (const side of [1, -1]) {
        flipper(0.14 * L, side * 0.22 * L, 0.34 * L, 0.06 * L, side * (1.0 + 0.5 * paddle));
        flipper(-0.2 * L, side * 0.15 * L, 0.2 * L, 0.045 * L, side * (2.3 - 0.3 * paddle));
      }
      // Head on a short neck.
      setTone(c, 0.62, s.fam);
      c.beginPath();
      c.ellipse(0.46 * L, 0, 0.12 * L, 0.085 * L, 0, 0, TAU);
      c.fill();
      for (const [k, t] of [[1, 0.4], [0.8, 0.56], [0.56, 0.72], [0.3, 0.88]] as const) {
        setTone(c, t, s.fam);
        c.beginPath();
        c.ellipse(0, 0, 0.36 * L * k, 0.3 * L * k, 0, 0, TAU);
        c.fill();
      }
      setTone(c, 0.98, s.fam);
      for (const side of [1, -1]) {
        c.beginPath();
        c.arc(0.5 * L, side * 0.04 * L, Math.max(cellW * 0.45, L * 0.012), 0, TAU);
        c.fill();
      }
      c.restore();
    };

    const blit = (c: CanvasRenderingContext2D, rows: string[], cx: number, cy: number, fam: number, flip: boolean) => {
      const sc = clamp(Math.round(base() / (rows.length > 6 ? 190 : 330)), 1, 3);
      const cw = sc * cellW;
      const ch = sc * cellH;
      const w = rows[0].length;
      const gx = Math.round((cx - (w * cw) / 2) / cellW) * cellW;
      const gy = Math.round((cy - (rows.length * ch) / 2) / cellH) * cellH;
      for (let j = 0; j < rows.length; j++) {
        for (let i = 0; i < w; i++) {
          const k = rows[j][i];
          if (k === ".") continue;
          const [tone, shift] = SHADE[k];
          setTone(c, tone, (fam + shift) % 3);
          c.fillRect(gx + (flip ? w - 1 - i : i) * cw, gy + j * ch, cw, ch);
        }
      }
    };

    const drawFish = (c: CanvasRenderingContext2D, f: Fish) => {
      const frame = Math.abs(Math.floor(clock * 5 + (f.phase || 0))) % 2;
      blit(c, PIXELS.fish[frame], f.x, f.y, f.fam, f.vx < 0);
    };
    const drawBird = (c: CanvasRenderingContext2D, f: Fish) => {
      const frame = Math.abs(Math.floor(clock * 4 + (f.phase || 0))) % 2;
      blit(c, PIXELS.bird[frame], f.x, f.y, f.fam, false);
    };
    const drawButterfly = (c: CanvasRenderingContext2D, f: Flutter) => {
      const frame = Math.abs(Math.floor(clock * 6 + (f.phase || 0))) % 2;
      blit(c, PIXELS.butterfly[frame], f.x, f.y, f.fam, false);
    };

    const drawMeadow = (c: CanvasRenderingContext2D) => {
      const gy = ground();
      // A pale moon, then the trees, then the ground and grass.
      setTone(c, 0.2, 1);
      c.beginPath();
      c.arc(W * 0.8, H * 0.2, base() * 0.1, 0, TAU);
      c.fill();
      setTone(c, 0.3, 1);
      c.beginPath();
      c.arc(W * 0.8, H * 0.2, base() * 0.062, 0, TAU);
      c.fill();
      for (const t of trees) {
        const sway = Math.sin(clock * 0.8 + t.phase) * t.h * 0.012 * stillOrNot();
        setTone(c, 0.18, 2, true);
        c.lineWidth = Math.max(cellW * 1.5, t.h * 0.045);
        c.lineCap = "round";
        c.beginPath();
        c.moveTo(t.x, gy);
        c.lineTo(t.x + sway, gy - t.h * 0.4);
        c.stroke();
        if (t.pine) {
          for (let k = 0; k < 4; k++) {
            const y = gy - t.h * (0.2 + k * 0.2);
            const w = t.h * (0.27 - k * 0.055);
            setTone(c, 0.17 + k * 0.035, t.fam);
            tri(c, { x: t.x - w + sway * (k + 1), y }, { x: t.x + w + sway * (k + 1), y }, { x: t.x + sway * (k + 2), y: y - t.h * 0.3 });
          }
        } else {
          for (const [dx, dy, r, tone] of [[0, 0.62, 0.26, 0.17], [-0.14, 0.52, 0.17, 0.21], [0.15, 0.55, 0.18, 0.25], [0, 0.7, 0.14, 0.28]] as const) {
            setTone(c, tone, t.fam);
            c.beginPath();
            c.arc(t.x + dx * t.h + sway * 2.5, gy - dy * t.h, r * t.h, 0, TAU);
            c.fill();
          }
        }
      }
      setTone(c, 0.12, 2);
      c.fillRect(0, gy, W, H - gy);
      setTone(c, 0.24, 2);
      c.fillRect(0, gy, W, Math.max(cellH * 0.7, 2));
      setTone(c, 0.3, 1, true);
      c.lineWidth = Math.max(cellW * 0.85, 2);
      c.lineCap = "round";
      const gap = cellW * 2.4;
      c.beginPath();
      for (let x = gap * 0.5, i = 0; x < W; x += gap, i++) {
        const h = cellH * (0.7 + 1.3 * rnd(i + 5));
        const sw = Math.sin(clock * 1.3 + i * 0.7) * cellW * 0.8 * stillOrNot();
        c.moveTo(x, gy + cellH * 0.4);
        c.lineTo(x + sw, gy - h);
      }
      c.stroke();
    };

    const spriteScale = () => clamp(Math.floor((base() * 0.62) / (SPRITES.cat.rows.length * cellH)), 1, 3);

    const stepPets = (dt: number) => {
      const sp = spriteScale();
      const span = sp * cellW * SPRITE_W;
      for (const p of walkers) {
        if (p.t < 1) {
          p.t = Math.min(1, p.t + dt / p.dur);
          const e = p.t * p.t * (3 - 2 * p.t);
          p.x = p.startX + (p.targetX - p.startX) * e;
          if (p.t >= 1) p.wait = 2.5 + rnd(clock + p.phase) * 5;
          continue;
        }
        p.wait -= dt;
        let go = p.wait <= 0;
        let tx = p.x + (rnd(clock * 7 + p.phase) - 0.5) * W * 0.5;
        if (ptr.on && live.current.pointer !== "off" && Math.abs(ptr.x - p.x) < span * 1.6 && Math.abs(ptr.y - ground()) < base() * 0.7) {
          if (live.current.pointer === "avoid") {
            go = true;
            tx = p.x + (p.x >= ptr.x ? 1 : -1) * span * 1.5;
          } else if (Math.abs(ptr.x - p.x) > span * 0.5) {
            go = true;
            tx = ptr.x;
          }
        }
        if (!go) continue;
        const lo = Math.max(span * 0.7, W * 0.18);
        const hi = Math.min(W - span * 0.7, W * 0.82);
        tx = clamp(tx, lo, hi);
        for (let k = 0; k < 10 && walkers.some((o) => o !== p && Math.abs(o.targetX - tx) < span * 1.05); k++) tx = lo + rnd(clock * 13 + k + p.phase) * Math.max(0, hi - lo);
        if (walkers.some((o) => o !== p && Math.abs(o.targetX - tx) < span * 1.05)) {
          p.wait = 1.5;
          continue;
        }
        if (Math.abs(tx - p.x) < span * 0.25) tx = p.x + (p.x < W / 2 ? 1 : -1) * span * 0.6;
        p.startX = p.x;
        p.targetX = tx;
        p.hops = Math.max(1, Math.round(Math.abs(tx - p.x) / (span * 0.4)));
        p.dur = p.hops * 0.45;
        p.flip = tx >= p.x ? 1 : -1;
        p.t = 0;
      }
    };

    const drawPet = (c: CanvasRenderingContext2D, p: Walker) => {
      const sp = spriteScale();
      const spr = SPRITES[p.kind];
      const cw = sp * cellW;
      const ch = sp * cellH;
      const rowsN = spr.rows.length;
      const hop = p.t < 1 ? Math.abs(Math.sin(p.t * p.hops * Math.PI)) * 2.4 : 0;
      const gy = Math.round((ground() + p.lane * 0 - rowsN * ch) / cellH) * cellH - Math.round(hop * sp) * cellH;
      const gx = Math.round((p.x - (SPRITE_W / 2) * cw) / cellW) * cellW;
      const put = (rows: string[], lx: number, ly: number) => {
        for (let j = 0; j < rows.length; j++) {
          const row = rows[j];
          for (let i = 0; i < row.length; i++) {
            const k = row[i];
            if (k === ".") continue;
            const [tone, shift] = SHADE[k];
            setTone(c, tone, (p.fam + shift) % 3);
            const col = p.flip < 0 ? SPRITE_W - 1 - (lx + i) : lx + i;
            c.fillRect(gx + col * cw, gy + (ly + j) * ch, cw, ch);
          }
        }
      };
      const wag = p.kind === "dog" ? 5 : p.kind === "cat" ? 1.1 : 0;
      const t = spr.tails[Math.floor(clock * wag + p.phase) % 2];
      put(t.rows, t.x, t.y);
      put(spr.rows, 0, 0);
      if ((clock + p.phase * 2) % 4.4 < 0.16) for (const b of spr.blink) put(b.rows, b.x, b.y);
    };

    const raster = () => {
      const c = octx;
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.fillStyle = "#000";
      c.fillRect(0, 0, cols, rows);
      c.setTransform(1 / cellW, 0, 0, 1 / cellH, 0, 0);
      const L = base();
      if (animal === "jellyfish") jellies.forEach((j) => drawJelly(c, j, L));
      else if (animal === "school") fish.forEach((f) => drawFish(c, f));
      else if (animal === "birds") fish.forEach((f) => drawBird(c, f));
      else if (animal === "butterflies") flutters.forEach((f) => drawButterfly(c, f));
      else if (WALKERS.includes(animal)) {
        drawMeadow(c);
        walkers.forEach((w) => drawPet(c, w));
      } else if (animal === "turtle") swimmers.forEach((s) => drawTurtle(c, s, lenOf(s)));
      else if (animal === "manta") swimmers.forEach((s) => drawManta(c, s, lenOf(s)));
      else swimmers.forEach((s) => drawBody(c, s, lenOf(s)));
    };

    const paint = () => {
      raster();
      const data = octx.getImageData(0, 0, cols, rows).data;
      for (const b of buckets) b.length = 0;
      const calmK = live.current.calm;
      for (let r = 0; r < rows; r++) {
        for (let q = 0; q < cols; q++) {
          const i = (r * cols + q) * 4;
          const R = data[i];
          if (R < 22) continue;
          let t = (R / 255) * (1 - live.current.dim);
          const fam = clamp(Math.round((2 * data[i + 1]) / R), 0, 2);
          if (rect && calmK > 0) {
            const px = (q + 0.5) * cellW;
            const py = (r + 0.5) * cellH;
            const dx = Math.max(rect[0] - px, 0, px - rect[2]);
            const dy = Math.max(rect[1] - py, 0, py - rect[3]);
            t *= 1 - calmK * 0.7 * (1 - smooth(0, 140, Math.hypot(dx, dy)));
          }
          const lv = Math.round(t * LEVELS);
          if (lv < 1) continue;
          const ci = clamp(Math.round(t * (RAMP.length - 1)), 1, RAMP.length - 1);
          buckets[fam * LEVELS + lv - 1].push((r * cols + q) * 16 + ci);
        }
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (tiles) {
        for (let b = 0; b < buckets.length; b++) {
          const list = buckets[b];
          if (!list.length) continue;
          ctx.fillStyle = tileCss[b];
          ctx.beginPath();
          for (const v of list) {
            const cell = v >> 4;
            const x = (cell % cols) * cellW + 0.5;
            const y = Math.floor(cell / cols) * cellH + 0.5;
            ctx.rect(x, y, cellW - 1, cellH - 1);
          }
          ctx.fill();
        }
      }
      ctx.font = `500 ${fontPx}px ${FONT}`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let b = 0; b < buckets.length; b++) {
        const list = buckets[b];
        if (!list.length) continue;
        ctx.fillStyle = glyphCss[b];
        for (const v of list) {
          const cell = v >> 4;
          ctx.fillText(RAMP[v & 15], ((cell % cols) + 0.5) * cellW, (Math.floor(cell / cols) + 0.5) * cellH + 1);
        }
      }
      if (live.current.bubbles && (isSwimmer(animal) || animal === "jellyfish" || animal === "school")) {
        ctx.globalAlpha = 0.4;
        ctx.fillStyle = css(pal.ink);
        for (const b of bubs) ctx.fillText("·", (Math.floor(b.x / cellW) + 0.5) * cellW, (Math.floor(b.y / cellH) + 0.5) * cellH);
        ctx.globalAlpha = 1;
      }
      if (cv.style.opacity !== "1") cv.style.opacity = "1";
    };

    const refreshPalette = () => {
      palKey = live.current.colorway;
      pal = paletteOf(el, palKey);
      colors();
      dirty = true;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (!visible) return;
      const dt = clamp((now - last) / 1000, 0, 0.05);
      last = now;
      const lv = live.current;
      if (lv.colorway !== palKey) refreshPalette();
      const next = `${lv.scale}|${lv.calm}|${lv.dim}|${lv.bubbles}`;
      if (next !== sig) {
        sig = next;
        dirty = true;
      }
      if (lv.paused) {
        if (dirty) {
          readRect();
          paint();
          dirty = false;
        }
        return;
      }
      step(dt * lv.speed);
      paint();
      dirty = false;
    };

    const still = () => {
      readRect();
      for (let i = 0; i < 200; i++) step(0.05);
      paint();
    };

    const start = () => {
      cancelAnimationFrame(raf);
      if (reduced.matches) {
        still();
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      const r = el.getBoundingClientRect();
      if (r.width < 2 || r.height < 2) return;
      W = r.width;
      H = r.height;
      cv.width = Math.floor(W * dpr);
      cv.height = Math.floor(H * dpr);
      cols = Math.ceil(W / cellW);
      rows = Math.ceil(H / cellH);
      off.width = cols;
      off.height = rows;
      if (!seeded) seed();
      for (const s of swimmers) {
        s.x = clamp(s.x, 0, W);
        s.y = clamp(s.y, 0, H);
      }
      readRect();
      if (reduced.matches) still();
      else dirty = true;
    };

    const toLocal = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      ptr.x = e.clientX - r.left;
      ptr.y = e.clientY - r.top;
      ptr.on = e.pointerType !== "touch" && ptr.x >= 0 && ptr.y >= 0 && ptr.x <= r.width && ptr.y <= r.height;
    };
    const leave = () => {
      ptr.on = false;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      last = performance.now();
    });
    io.observe(el);
    const mo = new MutationObserver(refreshPalette);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-theme", "style"] });
    window.addEventListener("pointermove", toLocal, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    reduced.addEventListener("change", start);
    resize();
    start();

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", toLocal);
      document.documentElement.removeEventListener("pointerleave", leave);
      reduced.removeEventListener("change", start);
    };
  }, [animal, count, detail, tiles, avoid]);

  const sw = colorway === "theme" ? null : COLORWAYS[colorway];
  const gridInk = sw ? sw.ink : "var(--foreground)";
  const cw = tiles ? detail : detail * 0.6;
  return (
    <div
      ref={host}
      className={cn("relative isolate flex w-full items-center justify-center overflow-hidden bg-background", className)}
      style={{
        backgroundColor: sw?.bg,
        backgroundImage: tiles && grid ? `linear-gradient(to right, color-mix(in srgb, ${gridInk} 6%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in srgb, ${gridInk} 6%, transparent) 1px, transparent 1px)` : undefined,
        backgroundSize: tiles && grid ? `${cw}px ${detail}px` : undefined,
      }}
    >
      <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 size-full opacity-0 transition-opacity duration-700" />
      {children && (
        <div ref={content} className="relative z-10" style={sw ? { color: sw.ink } : undefined}>
          {children}
        </div>
      )}
    </div>
  );
}
