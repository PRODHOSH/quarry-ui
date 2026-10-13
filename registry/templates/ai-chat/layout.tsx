import { Suspense } from "react";
import { ChatShell } from "@/components/ai-chat/shell";

export default function AiChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <Suspense fallback={null}>
        <ChatShell>{children}</ChatShell>
      </Suspense>
    </div>
  );
}
