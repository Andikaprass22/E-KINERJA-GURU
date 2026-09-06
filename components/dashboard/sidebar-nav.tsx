"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Calendar,
  Star,
  Archive,
  User,
  FileCheck,
} from "lucide-react";
import { useSidebar } from "@/components/ui/sidebar";

interface SidebarNavProps {
  userRole: "ADMIN" | "PRINCIPAL" | "TEACHER";
}

const menuItems = {
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Manajemen Pengguna", icon: Users },
    { href: "/admin/semesters", label: "Semester", icon: Calendar },
    { href: "/admin/submissions", label: "Progress Upload", icon: FileCheck },
    { href: "/admin/evaluations", label: "Evaluasi", icon: Star },
    { href: "/admin/archive", label: "Arsip", icon: Archive },
  ],
  PRINCIPAL: [
    { href: "/principal", label: "Dashboard", icon: LayoutDashboard },
    { href: "/principal/evaluations", label: "Evaluasi", icon: Star },
    { href: "/principal/archive", label: "Arsip", icon: Archive },
  ],
  TEACHER: [
    { href: "/teacher", label: "Dashboard", icon: LayoutDashboard },
    { href: "/profile", label: "Profil", icon: User },
  ],
};

export function SidebarNav({ userRole }: SidebarNavProps) {
  const pathname = usePathname();
  const items = menuItems[userRole];
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <nav className="space-y-1.5">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`);

        return (
          <a
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
              isActive
                ? "bg-secondary text-primary font-bold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground font-medium"
            }`}
            title={isCollapsed ? item.label : ""}
          >
            <Icon
              size={20}
              className={`${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground group-hover:text-foreground"
              } shrink-0`}
            />
            <span
              className={`text-sm truncate transition-all duration-300 ${
                isCollapsed
                  ? "lg:opacity-0 lg:w-0"
                  : "opacity-100 w-auto"
              }`}
            >
              {item.label}
            </span>

            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-gradient-to-b from-primary to-teal-700 rounded-r-full hidden lg:block" />
            )}
          </a>
        );
      })}
    </nav>
  );
}
