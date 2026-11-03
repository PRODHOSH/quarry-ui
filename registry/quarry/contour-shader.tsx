"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type RGB = [number, number, number];

/** Turn any CSS colour, including oklch and var(--token), into [r, g, b] from 0 to 1. */
function toRgb(host: HTMLElement, css: string): RGB {
  const probe = document.createElement("span");
  probe.style.color = css;
  host.appendChild(probe);
  const resolved = getComputedStyle(probe).color;
  probe.remove();
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const x = c.getContext("2d", { willReadFrequently: true })!;
  x.fillStyle = resolved;
  x.fillRect(0, 0, 1, 1);
  const d = x.getImageData(0, 0, 1, 1).data;
  return [d[0] / 255, d[1] / 255, d[2] / 255];
}
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

const VERT = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
const FRAG = `
precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform float lines; uniform float pull;
uniform vec3 g0; uniform vec3 g1; uniform vec3 hi; uniform vec3 lo;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*n(p);p=p*2.03+vec2(7.1,3.7);a*=.5;}return v;}
void main(){
  vec2 uv=gl_FragCoord.xy/r;
  float k=min(r.x,r.y);
  vec2 q=(gl_FragCoord.xy-.5*r)/k;
  vec2 mm=(m*r-.5*r)/k;
  float d=length(q-mm);
  float bulge=pull*.22*exp(-d*d*7.);
  float fld=fbm(q*1.7+vec2(t*.035,-t*.028))+.28*fbm(q*3.6-vec2(t*.05,t*.02));
  fld+=bulge;
  float v=fld*lines;
  float line=1.-smoothstep(0.,.045,abs(fract(v)-.5));
  float idx=floor(v);
  float major=step(.5,fract(idx*.2+.1));
  vec3 bg=mix(g0,g1,clamp(uv.y*.7+fld*.35,0.,1.));
  vec3 col=bg;
  col+=mix(lo,hi,fld)*line*(.16+.5*smoothstep(.2,.9,fld))*(.6+.4*major);
  col+=hi*.10*pull*exp(-d*d*9.);
  col+=hi*.35*pull*line*exp(-d*d*14.);
  float vig=smoothstep(1.25,.25,length(q*vec2(.8,1.)));
  col*=.55+.45*vig;
  gl_FragColor=vec4(col,1.);
}`;

/**
 * A full area field of contour lines, drawn by one small WebGL shader. The lines drift like slow
 * terrain and swell around the pointer. Colours take any CSS value or theme token, it pauses off
 * screen, and reduced motion renders a single frame.
 */
export function ContourShader({
  ground = "var(--foreground)",
  line = "var(--primary)",
  glow = "var(--ring)",
  density = 10,
  speed = 1,
  pull = 1,
  children,
  className,
}: {
  /** The dark base colour behind the lines. */
  ground?: string;
  /** The bright line colour. */
  line?: string;
  /** The second line colour, blended in where the terrain is low. */
  glow?: string;
  /** How many contour levels. */
  density?: number;
  speed?: number;
  /** How strongly the pointer lifts the field. */
  pull?: number;
  children?: ReactNode;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const live = useRef({ ground, line, glow, density, speed, pull });
  const kickRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    live.current = { ground, line, glow, density, speed, pull };
    kickRef.current?.();
  }, [ground, line, glow, density, speed, pull]);

  useEffect(() => {
    const el = host.current!;
    const cv = canvas.current!;
    const gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power" });
    if (!gl) return;
    const compile = (type: number, src: string) => {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(gl.VERTEX_SHADER, VERT);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const U: Record<string, WebGLUniformLocation | null> = {};
    ["r", "t", "m", "lines", "pull", "g0", "g1", "hi", "lo"].forEach((n) => (U[n] = gl.getUniformLocation(prog, n)));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mouse = { x: 0.62, y: 0.55, tx: 0.62, ty: 0.55 };
    let visible = true;
    let raf = 0;
    let last = performance.now();
    let time = 12;
    let key = "";
    let colors: { g0: RGB; g1: RGB; hi: RGB; lo: RGB } | null = null;

    const resolve = () => {
      const lv = live.current;
      const k = `${lv.ground}|${lv.line}|${lv.glow}`;
      if (k === key && colors) return;
      key = k;
      const ink = toRgb(el, lv.ground);
      const hi = toRgb(el, lv.line);
      const lo = toRgb(el, lv.glow);
      colors = { g0: mix(ink, [0, 0, 0], 0.15), g1: mix(ink, lo, 0.28), hi, lo };
    };

    const resize = () => {
      const small = window.innerWidth < 768;
      const scale = Math.min(window.devicePixelRatio || 1, small ? 1 : 1.5) * (small ? 0.7 : 0.85);
      const w = Math.max(2, Math.round(cv.clientWidth * scale));
      const h = Math.max(2, Math.round(cv.clientHeight * scale));
      if (cv.width !== w || cv.height !== h) {
        cv.width = w;
        cv.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    const frame = (now: number) => {
      raf = 0;
      const lv = live.current;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      time += dt * lv.speed;
      mouse.x += (mouse.tx - mouse.x) * 0.06;
      mouse.y += (mouse.ty - mouse.y) * 0.06;
      resolve();
      const c = colors!;
      gl.uniform2f(U.r, cv.width, cv.height);
      gl.uniform1f(U.t, time);
      gl.uniform2f(U.m, mouse.x, mouse.y);
      gl.uniform1f(U.lines, lv.density);
      gl.uniform1f(U.pull, lv.pull);
      gl.uniform3fv(U.g0, c.g0);
      gl.uniform3fv(U.g1, c.g1);
      gl.uniform3fv(U.hi, c.hi);
      gl.uniform3fv(U.lo, c.lo);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && !reduced.matches && !document.hidden) raf = requestAnimationFrame(frame);
    };
    const kick = () => {
      if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const move = (e: PointerEvent) => {
      const b = cv.getBoundingClientRect();
      mouse.tx = (e.clientX - b.left) / b.width;
      mouse.ty = 1 - (e.clientY - b.top) / b.height;
    };
    const onResize = () => {
      resize();
      kick();
    };
    el.addEventListener("pointermove", move);
    window.addEventListener("resize", onResize, { passive: true });
    document.addEventListener("visibilitychange", kick);
    const io = new IntersectionObserver(([en]) => {
      visible = en.isIntersecting;
      if (visible) kick();
    });
    io.observe(el);
    const lost = (e: Event) => e.preventDefault();
    cv.addEventListener("webglcontextlost", lost);
    resize();
    kick();
    kickRef.current = kick;

    return () => {
      cancelAnimationFrame(raf);
      kickRef.current = null;
      io.disconnect();
      el.removeEventListener("pointermove", move);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", kick);
      cv.removeEventListener("webglcontextlost", lost);
    };
  }, []);

  return (
    <div ref={host} className={cn("relative isolate h-full min-h-[24rem] w-full overflow-hidden bg-foreground", className)}>
      <canvas ref={canvas} aria-hidden className="absolute inset-0 size-full" />
      {children && <div className="pointer-events-none relative z-10 grid h-full min-h-[inherit] place-items-center text-background">{children}</div>}
    </div>
  );
}
