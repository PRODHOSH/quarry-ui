import { Suspense } from "react";
import { FileManagerShell } from "@/components/file-manager/shell";
import { themeStyle, THEMES } from "@/lib/themes";

/** Site only: forces the template into its own dark theme, so a visitor sees it as designed. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${THEMES.vault.mode} h-svh`} style={themeStyle("vault")}>
      <Suspense fallback={null}>
        <FileManagerShell>{children}</FileManagerShell>
      </Suspense>
    </div>
  );
}
