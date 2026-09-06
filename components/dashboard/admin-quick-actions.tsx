"use client";

import Link from "next/link";
import { Users, Calendar, FileText, BarChart3 } from "lucide-react";

const actions = [
  {
    title: "Kelola Pengguna",
    desc: "Manajemen akun",
    icon: Users,
    href: "/admin/users",
    colorClass: "text-primary",
    bgClass: "bg-secondary",
    hoverBorder: "hover:border-primary/30",
    hoverBg: "hover:bg-secondary/50",
    textHover: "group-hover:text-primary",
  },
  {
    title: "Semester",
    desc: "Atur periode",
    icon: Calendar,
    href: "/admin/semesters",
    colorClass: "text-teal-700",
    bgClass: "bg-accent",
    hoverBorder: "hover:border-teal-300",
    hoverBg: "hover:bg-accent/50",
    textHover: "group-hover:text-teal-700",
  },
  {
    title: "Progress Upload",
    desc: "Pantau dokumen",
    icon: FileText,
    href: "/admin/submissions",
    colorClass: "text-amber-600",
    bgClass: "bg-amber-100",
    hoverBorder: "hover:border-amber-300",
    hoverBg: "hover:bg-amber-50/50",
    textHover: "group-hover:text-amber-700",
  },
  {
    title: "Evaluasi",
    desc: "Penilaian kinerja",
    icon: BarChart3,
    href: "/admin/evaluations",
    colorClass: "text-emerald-600",
    bgClass: "bg-emerald-100",
    hoverBorder: "hover:border-emerald-300",
    hoverBg: "hover:bg-emerald-50/50",
    textHover: "group-hover:text-emerald-700",
  },
];

export function AdminQuickActions() {
  return (
    <div className="lg:col-span-2 bg-card rounded-2xl p-5 sm:p-6 border border-border shadow-sm flex flex-col hover:shadow-md transition-shadow">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-foreground">Aksi Cepat</h3>
          <p className="text-xs text-muted-foreground">Pintasan operasional E-KINERJA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-1">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={`group p-4 rounded-xl border border-border ${action.hoverBorder} ${action.hoverBg} cursor-pointer transition-all duration-200 flex items-start gap-4 active:scale-[0.98]`}
          >
            <div className={`w-12 h-12 rounded-xl ${action.bgClass} group-hover:bg-card group-hover:shadow-sm flex items-center justify-center shrink-0 transition-all duration-200`}>
              <action.icon size={22} className={`${action.colorClass} transition-colors group-hover:scale-110`} />
            </div>
            <div className="flex-1 pt-1">
              <h4 className={`text-sm font-bold text-foreground ${action.textHover} transition-colors`}>
                {action.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{action.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
