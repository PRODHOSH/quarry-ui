import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Chakra_Petch,
  DM_Sans,
  Figtree,
  Fraunces,
  Geist_Mono,
  IBM_Plex_Sans,
  Instrument_Serif,
  JetBrains_Mono,
  Orbitron,
  Outfit,
  Playfair_Display,
  Poppins,
  Sora,
  Space_Grotesk,
  Space_Mono,
  Syne,
} from "next/font/google";
import localFont from "next/font/local";
import { HideOnHome } from "@/components/site/hide-on-home";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { SITE_NAME, SITE_TAGLINE, SITE_URL } from "@/lib/site";
import "./globals.css";

const figtree = Figtree({ subsets: ["latin"], variable: "--font-figtree" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });
// Display fonts used by the per-component presets. They load on demand and are not preloaded.
const instrument = Instrument_Serif({ subsets: ["latin"], preload: false, weight: "400", variable: "--font-instrument" });
const orbitron = Orbitron({ subsets: ["latin"], preload: false, variable: "--font-orbitron" });
const sora = Sora({ subsets: ["latin"], preload: false, variable: "--font-sora" });
const fraunces = Fraunces({ subsets: ["latin"], preload: false, variable: "--font-fraunces" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], preload: false, variable: "--font-jetbrains" });
const bricolage = Bricolage_Grotesque({ subsets: ["latin"], preload: false, variable: "--font-bricolage" });
const chakra = Chakra_Petch({ subsets: ["latin"], preload: false, weight: ["400", "500", "600", "700"], variable: "--font-chakra" });
const poppins = Poppins({ subsets: ["latin"], preload: false, weight: ["400", "500", "600", "700"], variable: "--font-poppins" });
const plex = IBM_Plex_Sans({ subsets: ["latin"], preload: false, weight: ["400", "500", "600"], variable: "--font-plex" });
const dmSans = DM_Sans({ subsets: ["latin"], preload: false, variable: "--font-dm-sans" });
const syne = Syne({ subsets: ["latin"], preload: false, variable: "--font-syne" });
const outfit = Outfit({ subsets: ["latin"], preload: false, variable: "--font-outfit" });
const playfair = Playfair_Display({ subsets: ["latin"], preload: false, variable: "--font-playfair" });
const grotesk = Space_Grotesk({ subsets: ["latin"], preload: false, variable: "--font-grotesk" });
const presetFonts = [instrument, orbitron, sora, fraunces, jetbrains, bricolage, chakra, poppins, plex, grotesk, syne, outfit, playfair, dmSans].map((f) => f.variable).join(" ");
const generalSans = localFont({
  src: [
    { path: "./fonts/GeneralSans-400.woff2", weight: "400" },
    { path: "./fonts/GeneralSans-500.woff2", weight: "500" },
    { path: "./fonts/GeneralSans-600.woff2", weight: "600" },
  ],
  variable: "--font-general-sans",
  display: "swap",
});
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${SITE_NAME} — ${SITE_TAGLINE}`, template: `%s — ${SITE_NAME}` },
  description:
    "A free library of production-ready React components and templates. Install with shadcn or hand a prompt to your AI tool.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${figtree.variable} ${presetFonts} ${spaceMono.variable} ${generalSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <HideOnHome>
          <SiteFooter />
        </HideOnHome>
      </body>
    </html>
  );
}
