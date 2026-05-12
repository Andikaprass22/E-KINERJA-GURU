"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Star, 
  Archive,
  User
} from "lucide-react";

interface SidebarNavProps {
  userRole: "ADMIN" | "PRINCIPAL" | "TEACHER";
}

const menuItems = {
  ADMIN: [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/users", label: "Manajemen Pengguna", icon: Users },
    { href: "/admin/semesters", label: "Semester", icon: Calendar },
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

  return (
    <nav className="space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
        
        return (
          <motion.div
            key={item.href}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={isActive ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start",
                isActive && "bg-secondary font-semibold"
              )}
              asChild
            >
              <a href={item.href}>
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </a>
            </Button>
          </motion.div>
        );
      })}
    </nav>
  );
}
