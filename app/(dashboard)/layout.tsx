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
      <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden selection:bg-indigo-100 selection:text-indigo-900 w-full">
        <Sidebar className="border-r border-slate-200 bg-white shadow-2xl lg:shadow-none">
          <SidebarHeader className="h-16 flex items-center justify-between px-5 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white font-bold text-lg shrink-0 shadow-sm shadow-indigo-200">
                E
              </div>
              <div className="group-data-[collapsible=icon]:hidden overflow-hidden transition-all duration-300">
                <h1 className="font-bold text-sm leading-tight text-slate-900 tracking-tight whitespace-nowrap">
                  E-KINERJA GURU
                </h1>
                <p className="text-[11px] text-slate-500 font-medium whitespace-nowrap">
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
