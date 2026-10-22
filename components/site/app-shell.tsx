"use client";

import type { ComponentProps, ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/auth/auth-provider";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { AppSidebar } from "@/components/site/app-sidebar";
import { TopBar } from "@/components/site/top-bar";

type SidebarProps = Omit<ComponentProps<typeof AppSidebar>, "children">;

/**
 * The frame around every page: one sidebar that is always there, a slim bar across the top, and the
 * page beside it. App previews under /preview render full screen on their own, so they skip it.
 */
export function AppShell({ children, ...sidebar }: SidebarProps & { children: ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/preview")) return <>{children}</>;
  return (
    <AuthProvider>
      <AppSidebar {...sidebar}>
        <TopBar />
        <main className="min-w-0 flex-1 px-4 pb-10 pt-6 sm:px-8 lg:px-12 lg:pt-4">{children}</main>
      </AppSidebar>
      <SignInDialog />
    </AuthProvider>
  );
}
