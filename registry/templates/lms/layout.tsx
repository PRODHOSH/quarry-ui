import { Suspense } from "react";
import { Manrope } from "next/font/google";
import { LmsShell } from "@/components/lms/shell";

const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope" });

export default function LmsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={manrope.variable}>
      <Suspense fallback={null}>
        <LmsShell>{children}</LmsShell>
      </Suspense>
    </div>
  );
}
