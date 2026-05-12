import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Sidebar, SidebarContent, SidebarHeader, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "./logout-button";
import { DashboardLoadingSkeleton } from "./loading-skeleton";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { AnimatedContent } from "@/components/dashboard/animated-content";

async function SessionCheck({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const userRole = session.user.role as "ADMIN" | "PRINCIPAL" | "TEACHER";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {session.user.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">E-KINERJA GURU</span>
                <span className="text-xs text-muted-foreground">SD N 1 Pancor</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="px-3 py-4">
            <SidebarNav userRole={userRole} />
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 flex flex-col">
          <header className="border-b">
            <div className="flex h-14 items-center justify-between px-4">
              <SidebarTrigger />
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{session.user.name}</span>
                    <span className="text-xs text-muted-foreground">{userRole}</span>
                  </div>
                </div>
                <LogoutButton />
              </div>
            </div>
          </header>
          <AnimatedContent>{children}</AnimatedContent>
        </main>
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
