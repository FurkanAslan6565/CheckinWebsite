"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toIntlLocale, type AdminLocale } from "@/lib/admin-locale";

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
  createdAt: string;
  opportunity: { title: string; slug: string };
}

const statusVariant = (status: string) => {
  if (status === "ACCEPTED") return "success" as const;
  if (status === "REJECTED") return "danger" as const;
  return "warning" as const;
};

export default function ApplicationsTable({
  applications,
}: {
  applications: Application[];
}) {
  const router = useRouter();
  const locale = useLocale() as AdminLocale;
  const [updating, setUpdating] = useState<string | null>(null);
  const t = useTranslations("admin.applications");
  const tCommon = useTranslations("admin.common");
  const tStatus = useTranslations("admin.status.application");

  async function updateStatus(id: string, status: string) {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) router.refresh();
    } finally {
      setUpdating(null);
    }
  }

  return (
    <DataTable
      data={applications}
      keyExtractor={(a) => a.id}
      emptyMessage={t("empty")}
      columns={[
        {
          key: "name",
          header: t("table.candidate"),
          render: (a) => (
            <div>
              <p className="font-medium text-slate-900">
                {a.firstName} {a.lastName}
              </p>
              <p className="text-xs text-slate-500">{a.email}</p>
            </div>
          ),
        },
        {
          key: "opportunity",
          header: t("table.opportunity"),
          render: (a) => (
            <span className="text-slate-600 text-sm">{a.opportunity.title}</span>
          ),
        },
        {
          key: "date",
          header: t("table.date"),
          render: (a) => (
            <span className="text-slate-500">
              {formatDate(a.createdAt, toIntlLocale(locale))}
            </span>
          ),
        },
        {
          key: "status",
          header: tCommon("status"),
          render: (a) => (
            <Badge variant={statusVariant(a.status)}>
              {tStatus(a.status as "PENDING")}
            </Badge>
          ),
        },
        {
          key: "actions",
          header: tCommon("actions"),
          render: (a) => (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              {a.status !== "ACCEPTED" && (
                <Button
                  size="sm"
                  variant="outline"
                  isLoading={updating === a.id}
                  onClick={() => updateStatus(a.id, "ACCEPTED")}
                >
                  {tCommon("accept")}
                </Button>
              )}
              {a.status !== "REJECTED" && (
                <Button
                  size="sm"
                  variant="ghost"
                  isLoading={updating === a.id}
                  onClick={() => updateStatus(a.id, "REJECTED")}
                >
                  {tCommon("reject")}
                </Button>
              )}
            </div>
          ),
        },
      ]}
    />
  );
}
