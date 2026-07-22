"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Briefcase,
  FileText,
  Users,
  Image,
  Images,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import type { Role } from "@prisma/client";
import {
  canManageProjects,
  canManageOpportunities,
  canManageNews,
  canManagePartners,
  canManageGallery,
  canViewApplications,
  canManageUsers,
} from "@/lib/permissions";
import { useState } from "react";
import { useTranslations } from "next-intl";

interface NavItem {
  href: string;
  labelKey:
    | "dashboard"
    | "projects"
    | "opportunities"
    | "applications"
    | "news"
    | "partners"
    | "gallery"
    | "media"
    | "messages"
    | "settings";
  icon: React.ComponentType<{ className?: string }>;
  show: (role: Role) => boolean;
}

const navItems: NavItem[] = [
  {
    href: "/admin",
    labelKey: "dashboard",
    icon: LayoutDashboard,
    show: () => true,
  },
  {
    href: "/admin/projects",
    labelKey: "projects",
    icon: FolderKanban,
    show: canManageProjects,
  },
  {
    href: "/admin/opportunities",
    labelKey: "opportunities",
    icon: Briefcase,
    show: canManageOpportunities,
  },
  {
    href: "/admin/applications",
    labelKey: "applications",
    icon: ClipboardList,
    show: canViewApplications,
  },
  {
    href: "/admin/news",
    labelKey: "news",
    icon: FileText,
    show: canManageNews,
  },
  {
    href: "/admin/partners",
    labelKey: "partners",
    icon: Users,
    show: canManagePartners,
  },
  {
    href: "/admin/gallery",
    labelKey: "gallery",
    icon: Images,
    show: canManageGallery,
  },
  {
    href: "/admin/media",
    labelKey: "media",
    icon: Image,
    show: (role) => canManageGallery(role) || canManageProjects(role),
  },
  {
    href: "/admin/messages",
    labelKey: "messages",
    icon: Mail,
    show: (role) => role === "SUPER_ADMIN" || role === "ADMIN",
  },
  {
    href: "/admin/settings",
    labelKey: "settings",
    icon: Settings,
    show: canManageUsers,
  },
];

export default function AdminSidebar({ role }: { role: Role }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const t = useTranslations("admin.nav");
  const tBrand = useTranslations("admin.brand");
  const visibleItems = navItems.filter((item) => item.show(role));

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen flex flex-col transition-all duration-300",
        "bg-[#0A0E1A] border-r border-white/[0.06]",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/[0.06]">
        {!collapsed && (
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 relative flex items-center justify-center shrink-0">
              <img src="/Logos/Check-IN/Other/IN-Marca agua-01.png" alt="Check-IN" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm font-[family-name:var(--font-heading)] leading-tight">
                {tBrand("name")}
              </p>
              <p className="text-slate-500 text-[10px] uppercase tracking-wider">
                {tBrand("cms")}
              </p>
            </div>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          aria-label={collapsed ? t("expandMenu") : t("collapseMenu")}
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {visibleItems.map((item) => {
          const isActive =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          const label = t(item.labelKey);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[hsl(var(--accent-blue))]/15 text-[hsl(var(--accent-blue))] border border-[hsl(var(--accent-blue))]/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/[0.06]">
        <button
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium",
            "text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>{t("logout")}</span>}
        </button>
      </div>
    </aside>
  );
}
