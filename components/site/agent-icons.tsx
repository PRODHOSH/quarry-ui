import type { ReactNode } from "react";
import ClaudeCodeIcon from "@thesvg/react/claude-code";
import CodexIcon from "@thesvg/react/codex-openai";
import CursorIcon from "@thesvg/react/cursor";
import ReplitIcon from "@thesvg/react/replit";
import LovableIcon from "@thesvg/react/lovable";
import BoltIcon from "@thesvg/react/bolt";
import V0Icon from "@thesvg/react/v0-vercel";

export const AGENT_ICONS: Record<string, (cls: string) => ReactNode> = {
  "claude-code": (c) => <ClaudeCodeIcon className={c} />,
  codex: (c) => <CodexIcon className={c} />,
  cursor: (c) => <CursorIcon className={c} />,
  v0: (c) => <V0Icon className={c} />,
  lovable: (c) => <LovableIcon className={c} />,
  bolt: (c) => <BoltIcon className={c} />,
  replit: (c) => <ReplitIcon className={c} />,
};
