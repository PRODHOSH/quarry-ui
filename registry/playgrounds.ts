/**
 * Site only. Live controls shown under a preview. Each control maps to a prop of the component, so
 * what you tune here is exactly what you would pass in your own code.
 */
export type Control =
  | { key: string; label: string; type: "color"; value: string }
  | { key: string; label: string; type: "range"; value: number; min: number; max: number; step: number }
  | { key: string; label: string; type: "choice"; value: string; options: { value: string; label: string }[] }
  | { key: string; label: string; type: "toggle"; value: boolean };

const color = (key: string, label: string, value: string): Control => ({ key, label, type: "color", value });
const range = (key: string, label: string, value: number, min: number, max: number, step = 1): Control => ({ key, label, type: "range", value, min, max, step });
const choice = (key: string, label: string, value: string, options: [string, string][]): Control => ({
  key,
  label,
  type: "choice",
  value,
  options: options.map(([v, l]) => ({ value: v, label: l })),
});
const toggle = (key: string, label: string, value: boolean): Control => ({ key, label, type: "toggle", value });

export const PLAYGROUNDS: Record<string, Control[]> = {
  "flow-field": [
    color("color", "Colour", "#3ddc97"),
    color("accent", "Accent", "#ffffff"),
    choice("interaction", "Cursor", "swirl", [["off", "Off"], ["swirl", "Swirl"], ["repel", "Repel"], ["attract", "Attract"]]),
    range("density", "Particles", 900, 200, 2200, 50),
    range("speed", "Speed", 1, 0.2, 3, 0.1),
    range("strength", "Cursor force", 1, 0.2, 3, 0.1),
  ],
  "dot-ripple": [
    color("color", "Active colour", "#fafafa"),
    color("accent", "Resting colour", "#6b6b6b"),
    choice("interaction", "Cursor", "push", [["off", "Off"], ["push", "Push"], ["pull", "Pull"]]),
    range("spacing", "Spacing", 28, 16, 56, 1),
    range("radius", "Reach", 150, 60, 320, 5),
    toggle("ripples", "Click ripples", true),
  ],
  "aurora-mesh": [
    color("color", "Colour one", "#d4af37"),
    color("color2", "Colour two", "#e0603a"),
    color("color3", "Colour three", "#2f7f6f"),
    choice("interaction", "Cursor", "follow", [["off", "Off"], ["follow", "Follow"]]),
    range("size", "Glow size", 0.55, 0.25, 0.9, 0.05),
    range("speed", "Speed", 1, 0.2, 3, 0.1),
    range("opacity", "Strength", 0.6, 0.2, 1, 0.05),
  ],
  constellation: [
    color("color", "Line colour", "#ff6a2b"),
    color("accent", "Point colour", "#a08877"),
    choice("interaction", "Cursor", "connect", [["off", "Off"], ["connect", "Connect"], ["repel", "Repel"]]),
    range("count", "Points", 80, 20, 200, 5),
    range("linkDistance", "Link distance", 130, 60, 240, 5),
    range("speed", "Speed", 1, 0.2, 3, 0.1),
  ],
  "wave-lines": [
    color("color", "First colour", "#0e7490"),
    color("accent", "Last colour", "#7aa7b5"),
    choice("interaction", "Cursor", "lift", [["off", "Off"], ["lift", "Lift"], ["pinch", "Pinch"]]),
    range("lines", "Lines", 30, 8, 60, 1),
    range("amplitude", "Wave height", 18, 4, 50, 1),
    range("speed", "Speed", 1, 0.2, 3, 0.1),
  ],
  "compass-field": [
    color("color", "Active colour", "#b6f24a"),
    color("accent", "Resting colour", "#4a5a40"),
    choice("interaction", "Cursor", "toward", [["off", "Off"], ["toward", "Point at it"], ["away", "Point away"]]),
    range("spacing", "Spacing", 30, 18, 60, 1),
    range("length", "Needle length", 13, 6, 30, 1),
  ],
  "topo-lines": [
    color("color", "Lines", "#1c1c1c"),
    color("accent", "Index lines", "#e2531f"),
    choice("interaction", "Cursor", "hill", [["off", "Off"], ["hill", "Raise hill"], ["pit", "Dig pit"]]),
    range("levels", "Levels", 16, 6, 30, 1),
    range("scale", "Terrain size", 1.2, 0.5, 3, 0.1),
    range("detail", "Detail (px)", 12, 6, 24, 1),
    range("speed", "Speed", 1, 0.2, 3, 0.1),
  ],
  "dot-globe": [
    color("color", "Land", "#f5f0e6"),
    color("accent", "Arcs", "#ffb347"),
    choice("interaction", "Cursor", "drag", [["off", "Off"], ["drag", "Drag to spin"]]),
    range("dots", "Dots", 1600, 600, 3000, 100),
    range("size", "Size", 1, 0.5, 1.3, 0.05),
    range("spin", "Spin", 1, 0, 4, 0.1),
    range("arcs", "Arcs", 6, 0, 14, 1),
  ],
  starfield: [
    color("color", "Stars", "#ffffff"),
    choice("interaction", "Cursor", "parallax", [["off", "Off"], ["parallax", "Parallax"]]),
    range("density", "Stars", 1, 0.3, 2.5, 0.1),
    range("speed", "Drift", 1, 0, 4, 0.1),
    range("twinkle", "Twinkle", 0.5, 0, 1, 0.05),
    toggle("shooting", "Shooting stars", true),
  ],
  "square-grid": [
    color("color", "Lines", "#ffffff"),
    color("accent", "Lit squares", "#7aa7ff"),
    choice("interaction", "Cursor", "trail", [["off", "Off"], ["trail", "Light trail"]]),
    range("cell", "Square size", 44, 24, 96, 2),
    toggle("flash", "Idle blinking", true),
    toggle("fade", "Fade edges", true),
  ],
  "glow-trail": [
    color("color", "Core", "#fafafa"),
    color("accent", "Outer", "#7a5cff"),
    choice("interaction", "Cursor", "trail", [["off", "Off"], ["trail", "Leave a trail"]]),
    range("size", "Size", 46, 20, 110, 2),
    range("fade", "Trail length", 1, 0.4, 3, 0.1),
  ],
};
