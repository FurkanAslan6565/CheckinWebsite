"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/admin/DeleteButton";
import { useLocale, useTranslations } from "next-intl";
import { toIntlLocale, type AdminLocale } from "@/lib/admin-locale";

interface Opportunity {
  id: string;
  title: string;
  type: string;
  location: string;
  deadline: string;
  isPublished: boolean;
  _count: { applications: number };
}

export default function OpportunitiesTable({
  opportunities,
}: {
  opportunities: Opportunity[];
}) {
  const router = useRouter();
  const locale = useLocale() as AdminLocale;
  const t = useTranslations("admin.opportunities");
  const tTable = useTranslations("admin.table");
  const tCommon = useTranslations("admin.common");
  const tTypes = useTranslations("admin.enums.opportunityTypes");

  return (
    <DataTable
      data={opportunities}
      keyExtractor={(o) => o.id}
      onRowClick={(o) => router.push(`/admin/opportunities/${o.id}`)}
      emptyMessage={t("empty")}
      columns={[
        {
          key: "title",
          header: tTable("title"),
          render: (o) => (
            <div>
              <p className="font-medium text-slate-900">{o.title}</p>
              <p className="text-xs text-slate-500">{o.location}</p>
            </div>
          ),
        },
        {
          key: "type",
          header: tTable("type"),
          render: (o) => (
            <Badge variant="info">
              {tTypes(o.type as "VOLUNTEERING")}
            </Badge>
          ),
        },
        {
          key: "deadline",
          header: t("table.deadline"),
          render: (o) => (
            <span className="text-slate-600">
              {formatDate(o.deadline, toIntlLocale(locale))}
            </span>
          ),
        },
        {
          key: "applications",
          header: t("table.applications"),
          render: (o) => (
            <Badge variant={o._count.applications > 0 ? "warning" : "neutral"}>
              {o._count.applications}
            </Badge>
          ),
        },
        {
          key: "published",
          header: tCommon("status"),
          render: (o) =>
            o.isPublished ? (
              <Badge variant="success">{tCommon("published")}</Badge>
            ) : (
              <Badge variant="neutral">{tCommon("draft")}</Badge>
            ),
        },
        {
          key: "actions",
          header: "",
          className: "w-24",
          render: (o) => (
            <div onClick={(e) => e.stopPropagation()}>
              <DeleteButton
                endpoint={`/api/admin/opportunities/${o.id}`}
                label=""
              />
            </div>
          ),
        },
      ]}
    />
  );
}
