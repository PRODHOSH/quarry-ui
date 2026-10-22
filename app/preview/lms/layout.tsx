import { Suspense } from "react";
import { LmsShell } from "@/components/lms/shell";
import { themeStyle, THEMES } from "@/lib/themes";

/** Site only: shows the template in its own light theme with Manrope, as designed. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={THEMES.scholar.mode} style={themeStyle("scholar")}>
      <Suspense fallback={null}>
        <LmsShell>{children}</LmsShell>
      </Suspense>
    </div>
  );
}
