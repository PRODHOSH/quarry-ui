/** Small deterministic animation helpers. A scene is a pure function of time: frame = f(t). */

export const clamp = (x: number, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const ease = {
  linear: (t: number) => t,
  out: (t: number) => 1 - Math.pow(1 - t, 4),
  outCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  inCubic: (t: number) => t * t * t,
  inOut: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  outBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
};

/** Progress of `t` between a and b, eased and clamped to 0..1. */
export const prog = (t: number, a: number, b: number, e: (x: number) => number = ease.out) =>
  e(clamp((t - a) / (b - a)));

/** Piecewise path through [time, x, y] keyframes, eased per segment. */
export function path(t: number, frames: [number, number, number][], e = ease.inOut) {
  if (t <= frames[0][0]) return { x: frames[0][1], y: frames[0][2] };
  for (let i = 1; i < frames.length; i++) {
    const [t1, x1, y1] = frames[i];
    if (t <= t1) {
      const [t0, x0, y0] = frames[i - 1];
      const p = e(clamp((t - t0) / (t1 - t0)));
      return { x: lerp(x0, x1, p), y: lerp(y0, y1, p) };
    }
  }
  const last = frames[frames.length - 1];
  return { x: last[1], y: last[2] };
}
