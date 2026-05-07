"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Star, 
  BarChart3, 
  Archive,
  Upload,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/types";

interface NavItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-4 w-4" />,
    roles: ["ADMIN", "PRINCIPAL", "TEACHER"],
  },
  {
    title: "Kelola Pengguna",
    href: "/dashboard/admin/users",
    icon: <Users className="h-4 w-4" />,
    roles: ["ADMIN"],
  },
  {
    title: "Pengaturan Semester",
    href: "/dashboard/admin/semesters",
    icon: <Calendar className="h-4 w-4" />,
    roles: ["ADMIN"],
  },
  {
    title: "Evaluasi Guru",
    href: "/dashboard/admin/evaluations",
    icon: <Star className="h-4 w-4" />,
    roles: ["ADMIN"],
  },
  {
    title: "Arsip Laporan",
    href: "/dashboard/admin/archive",
    icon: <Archive className="h-4 w-4" />,
    roles: ["ADMIN"],
  },
  {
    title: "Dashboard Sekolah",
    href: "/dashboard/principal",
    icon: <BarChart3 className="h-4 w-4" />,
    roles: ["PRINCIPAL"],
  },
  {
    title: "Review Evaluasi",
    href: "/dashboard/principal/evaluations",
    icon: <Star className="h-4 w-4" />,
    roles: ["PRINCIPAL"],
  },
  {
    title: "Arsip Laporan",
    href: "/dashboard/principal/archive",
    icon: <Archive className="h-4 w-4" />,
    roles: ["PRINCIPAL"],
  },
  {
    title: "Dashboard Progres",
    href: "/dashboard/teacher",
    icon: <BarChart3 className="h-4 w-4" />,
    roles: ["TEACHER"],
  },
  {
    title: "Upload Dokumen",
    href: "/dashboard/teacher/upload",
    icon: <Upload className="h-4 w-4" />,
    roles: ["TEACHER"],
  },
  {
    title: "Riwayat Pengumpulan",
    href: "/dashboard/teacher/history",
    icon: <History className="h-4 w-4" />,
    roles: ["TEACHER"],
  },
];

interface SidebarNavProps {
  userRole: UserRole;
}

export function SidebarNav({ userRole }: SidebarNavProps) {
  const pathname = usePathname();

  const filteredItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <nav className="space-y-1">
      {filteredItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

        return (
          <Link key={item.href} href={item.href}>
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              {item.icon}
              <span>{item.title}</span>
            </motion.div>
          </Link>
        );
      })}
    </nav>
  );
}