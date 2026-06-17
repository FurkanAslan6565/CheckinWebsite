"use client";

import type { Role } from "@prisma/client";
import { Bell, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import AdminLocaleSwitcher from "@/components/admin/AdminLocaleSwitcher";
import type { AdminLocale } from "@/lib/admin-locale";

interface AdminHeaderProps {
  title: string;
  description?: string;
  user: {
    name?: string | null;
    email?: string | null;
    role: Role;
  };
  actions?: React.ReactNode;
}

export default function AdminHeader({
  title,
  description,
  user,
  actions,
}: AdminHeaderProps) {
  const locale = useLocale() as AdminLocale;
  const t = useTranslations("admin.header");
  const tRoles = useTranslations("admin.roles");

  return (
    <header className="sticky top-0 z-30 bg-[#FAFAFC]/80 backdrop-blur-xl border-b border-slate-200/80">
      <div className="flex items-center justify-between h-16 px-8">
        <div>
          <h1 className="text-xl font-semibold text-slate-900 font-[family-name:var(--font-heading)]">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-slate-500 mt-0.5">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {actions}
          <AdminLocaleSwitcher />
          <Link
            href={`/${locale}`}
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-sm text-slate-500 hover:text-[hsl(var(--accent-blue))] transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            {t("viewSite")}
          </Link>
          <button
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            aria-label={t("notifications")}
          >
            <Bell className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-[hsl(var(--european-blue))] flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {user.name?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-900 leading-tight">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">{tRoles(user.role)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
