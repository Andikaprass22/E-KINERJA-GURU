"use client";

import { useState, useEffect } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { LogoutButton } from "@/app/(dashboard)/logout-button";

interface DashboardHeaderProps {
  userName: string;
  userInitial: string;
  userRole: string;
}

export function DashboardHeader({
  userName,
  userInitial,
  userRole,
}: DashboardHeaderProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const mainArea = document.getElementById("main-scroll-area");
    if (!mainArea) return;

    const handleScroll = () => {
      setScrolled(mainArea.scrollTop > 10);
    };

    mainArea.addEventListener("scroll", handleScroll);
    return () => mainArea.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`h-16 shrink-0 bg-white/80 backdrop-blur-xl border-b transition-all duration-200 z-10 flex items-center px-4 sm:px-6 lg:px-8 ${
        scrolled ? "border-slate-200 shadow-sm" : "border-transparent"
      }`}
    >
      <div className="flex items-center gap-3 flex-1">
        <SidebarTrigger className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors" />

        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-sm font-medium shadow-sm shadow-indigo-200">
              {userInitial}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-900 truncate max-w-[140px]">
              {userName}
            </span>
            <span className="text-[11px] text-slate-500">{userRole}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <div className="h-6 w-px bg-slate-200 mr-3" />
        <LogoutButton />
      </div>
    </header>
  );
}
