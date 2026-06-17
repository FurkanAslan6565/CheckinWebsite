"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/admin/DeleteButton";
import { useLocale, useTranslations } from "next-intl";
import { toIntlLocale, type AdminLocale } from "@/lib/admin-locale";

interface Project {
  id: string;
  title: string;
  country: string;
  program: string;
  status: string;
  isPublished: boolean;
  updatedAt: string;
  author: { name: string };
}

const statusVariant = (status: string) => {
  if (status === "ACTIVE") return "success" as const;
  if (status === "DRAFT") return "warning" as const;
  return "neutral" as const;
};

export default function ProjectsTable({ projects }: { projects: Project[] }) {
  const router = useRouter();
  const locale = useLocale() as AdminLocale;
  const t = useTranslations("admin.projects");
  const tTable = useTranslations("admin.table");
  const tCommon = useTranslations("admin.common");
  const tStatus = useTranslations("admin.status.project");
  const tPrograms = useTranslations("admin.enums.programs");

  return (
    <DataTable
      data={projects}
      keyExtractor={(p) => p.id}
      onRowClick={(p) => router.push(`/admin/projects/${p.id}`)}
      emptyMessage={t("empty")}
      columns={[
        {
          key: "title",
          header: tTable("title"),
          render: (p) => (
            <div>
              <p className="font-medium text-slate-900">{p.title}</p>
              <p className="text-xs text-slate-500">{p.country}</p>
            </div>
          ),
        },
        {
          key: "program",
          header: tTable("program"),
          render: (p) => (
            <Badge variant="info">
              {tPrograms(p.program as "ERASMUS_PLUS")}
            </Badge>
          ),
        },
        {
          key: "status",
          header: tCommon("status"),
          render: (p) => (
            <div className="flex gap-1.5">
              <Badge variant={statusVariant(p.status)}>
                {tStatus(p.status as "DRAFT")}
              </Badge>
              {p.isPublished && (
                <Badge variant="success">{tCommon("live")}</Badge>
              )}
            </div>
          ),
        },
        {
          key: "author",
          header: tCommon("author"),
          render: (p) => (
            <span className="text-slate-600">{p.author.name}</span>
          ),
        },
        {
          key: "updated",
          header: tCommon("updated"),
          render: (p) => (
            <span className="text-slate-500">
              {formatDate(p.updatedAt, toIntlLocale(locale))}
            </span>
          ),
        },
        {
          key: "actions",
          header: "",
          className: "w-24",
          render: (p) => (
            <div onClick={(e) => e.stopPropagation()}>
              <DeleteButton
                endpoint={`/api/admin/projects/${p.id}`}
                label=""
              />
            </div>
          ),
        },
      ]}
    />
  );
}
