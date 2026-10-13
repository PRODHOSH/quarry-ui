import { Suspense } from "react";
import { ChatShell } from "@/components/ai-chat/shell";
import { themeStyle, THEMES } from "@/lib/themes";

/** Site only: forces the template into its own light theme, so a visitor sees it as designed. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${THEMES.converse.mode} h-svh`} style={themeStyle("converse")}>
      <Suspense fallback={null}>
        <ChatShell>{children}</ChatShell>
      </Suspense>
    </div>
  );
}
