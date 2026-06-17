"use client";

import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useTranslations } from "next-intl";

interface PageHeaderProps {
  title: string;
  description?: string;
  createHref?: string;
  createLabel?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({
  title,
  description,
  createHref,
  createLabel,
  actions,
}: PageHeaderProps) {
  const t = useTranslations("admin.common");

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 font-[family-name:var(--font-heading)]">
          {title}
        </h2>
        {description && (
          <p className="text-slate-500 mt-1">{description}</p>
        )}
      </div>
      <div className="flex items-center gap-3">
        {actions}
        {createHref && (
          <Link href={createHref}>
            <Button>{createLabel ?? t("createNew")}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}
