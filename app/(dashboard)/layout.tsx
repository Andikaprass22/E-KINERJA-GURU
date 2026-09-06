import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "./logout-button";
import { DashboardLoadingSkeleton } from "./loading-skeleton";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

async function SessionCheck({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user.role as "ADMIN" | "PRINCIPAL" | "TEACHER";
  const userName = session.user.name || "User";
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-muted/40 font-sans text-foreground overflow-hidden selection:bg-primary/20 selection:text-primary w-full">
        <Sidebar className="border-r border-border bg-card shadow-2xl lg:shadow-none">
          <SidebarHeader className="h-16 border-b border-border shrink-0 items-start justify-center ps-1 pe-5">
            <div className="flex items-center gap-3 w-[159px]">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-teal-700 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm shadow-primary/20">
                E
              </div>
              <div className="group-data-[collapsible=icon]:hidden overflow-hidden transition-all duration-300">
                <h1 className="font-bold text-sm leading-tight text-foreground tracking-tight whitespace-nowrap">
                  E-KINERJA GURU
                </h1>
                <p className="text-[11px] text-muted-foreground font-medium whitespace-nowrap">
                  SD N 1 Pancor
                </p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <SidebarNav userRole={userRole} />
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col h-screen min-w-0 overflow-hidden relative">
          <DashboardHeader
            userName={userName}
            userInitial={userInitial}
            userRole={userRole}
          />

          <main
            id="main-scroll-area"
            className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 scroll-smooth"
          >
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Suspense fallback={<DashboardLoadingSkeleton />}>
      <SessionCheck>{children}</SessionCheck>
    </Suspense>
  );
}
