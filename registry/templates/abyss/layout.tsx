import { Manrope } from "next/font/google";
import { AbyssRoot } from "@/components/abyss/auth";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function AbyssLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${manrope.variable} font-[family-name:var(--font-manrope)]`}>
      <AbyssRoot>{children}</AbyssRoot>
    </div>
  );
}
