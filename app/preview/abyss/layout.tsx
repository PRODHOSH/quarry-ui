import { AbyssRoot } from "@/components/abyss/auth";
import { themeStyle, THEMES } from "@/lib/themes";

/** Site only: forces the template into its own dark theme, so a visitor sees it as designed. */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={THEMES.abyss.mode} style={themeStyle("abyss")}>
      <AbyssRoot colorway="abyss">{children}</AbyssRoot>
    </div>
  );
}
