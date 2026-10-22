import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/site";

export const alt = `${SITE_NAME}: free React components and templates with real motion`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const logo = `data:image/png;base64,${readFileSync(join(process.cwd(), "public/brand/logo.png")).toString("base64")}`;

const chip = { display: "flex", alignItems: "center", height: 46, padding: "0 20px", whiteSpace: "nowrap", borderRadius: 999, border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.8)", fontSize: 21 } as const;

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", position: "relative", background: "#070707", color: "#fff", fontFamily: "sans-serif", overflow: "hidden" }}>
        {/* dotted grid, faded toward the edges */}
        <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: "radial-gradient(rgba(255,255,255,0.16) 1.5px, transparent 1.5px)", backgroundSize: "34px 34px" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", background: "radial-gradient(ellipse at 70% 45%, rgba(91,69,232,0.35), rgba(7,7,7,0) 58%), radial-gradient(ellipse at 0% 100%, rgba(7,7,7,0.95), rgba(7,7,7,0) 60%)" }} />

        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 0 56px 72px", width: 700, position: "relative" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logo} alt="" width={236} height={53} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>Components that</div>
            <div style={{ display: "flex", fontSize: 76, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>feel finished.</div>
            <div style={{ display: "flex", marginTop: 26, fontSize: 28, lineHeight: 1.4, color: "rgba(255,255,255,0.66)", maxWidth: 560 }}>Free React components, full app templates and backgrounds. One command to install.</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={chip}>Components</div>
            <div style={chip}>Templates</div>
            <div style={chip}>Backgrounds</div>
            <div style={chip}>Design systems</div>
          </div>
        </div>

        {/* a small stack of interface cards */}
        <div style={{ position: "absolute", right: 56, top: 70, display: "flex", flexDirection: "column", width: 400 }}>
          <div style={{ display: "flex", flexDirection: "column", padding: 26, borderRadius: 28, background: "#ffffff", color: "#12141f", transform: "rotate(3deg)", boxShadow: "0 30px 60px rgba(0,0,0,0.5)" }}>
            <div style={{ display: "flex", fontSize: 20, color: "#6b7080" }}>Pro</div>
            <div style={{ display: "flex", alignItems: "flex-end", marginTop: 6 }}>
              <div style={{ display: "flex", fontSize: 64, fontWeight: 800, letterSpacing: -2 }}>$24</div>
              <div style={{ display: "flex", fontSize: 22, color: "#6b7080", marginBottom: 12, marginLeft: 8 }}>/ month</div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", marginTop: 12, gap: 8 }}>
              <div style={{ display: "flex", height: 10, width: "88%", borderRadius: 6, background: "#e6e8ef" }} />
              <div style={{ display: "flex", height: 10, width: "64%", borderRadius: 6, background: "#e6e8ef" }} />
            </div>
            <div style={{ display: "flex", marginTop: 20, height: 52, borderRadius: 16, background: "#5b45e8", color: "#fff", fontSize: 22, fontWeight: 700, alignItems: "center", justifyContent: "center" }}>Get started</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", marginTop: -14, marginLeft: 36, padding: 22, borderRadius: 24, background: "#141414", border: "1px solid rgba(255,255,255,0.14)", transform: "rotate(-2deg)", boxShadow: "0 30px 60px rgba(0,0,0,0.6)" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <div style={{ display: "flex", width: 12, height: 12, borderRadius: 6, background: "#ff5f57" }} />
              <div style={{ display: "flex", width: 12, height: 12, borderRadius: 6, background: "#febc2e" }} />
              <div style={{ display: "flex", width: 12, height: 12, borderRadius: 6, background: "#28c840" }} />
            </div>
            <div style={{ display: "flex", marginTop: 16, fontSize: 20, color: "rgba(255,255,255,0.86)", fontFamily: "monospace" }}>$ npx shadcn add mega-footer</div>
          </div>
        </div>

        <div style={{ position: "absolute", right: 56, bottom: 38, display: "flex", fontSize: 22, color: "rgba(255,255,255,0.5)" }}>quarry-ui.vercel.app</div>
      </div>
    ),
    size
  );
}
