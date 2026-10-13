import { Suspense } from "react";
import { FileManagerShell } from "@/components/file-manager/shell";

export default function FileManagerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen">
      <Suspense fallback={null}>
        <FileManagerShell>{children}</FileManagerShell>
      </Suspense>
    </div>
  );
}
