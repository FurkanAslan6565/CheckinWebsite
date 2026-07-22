"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/admin/DeleteButton";
import { useLocale, useTranslations } from "next-intl";
import { toIntlLocale, type AdminLocale } from "@/lib/admin-locale";

interface NewsItem {
  id: string;
  title: string;
  isPublished: boolean;
  updatedAt: string;
  author: { name: string };
}

export default function NewsTable({ news }: { news: NewsItem[] }) {
  const router = useRouter();
  const locale = useLocale() as AdminLocale;
  const t = useTranslations("admin.news");
  const tTable = useTranslations("admin.table");
  const tCommon = useTranslations("admin.common");

  return (
    <DataTable
      data={news}
      keyExtractor={(n) => n.id}
      onRowClick={(n) => router.push(`/admin/news/${n.id}`)}
      emptyMessage={t("empty")}
      columns={[
        {
          key: "title",
          header: tTable("title"),
          render: (n) => (
            <p className="font-medium text-slate-900">{n.title}</p>
          ),
        },
        {
          key: "author",
          header: tCommon("author"),
          render: (n) => (
            <span className="text-slate-600">{n.author.name}</span>
          ),
        },
        {
          key: "status",
          header: tCommon("status"),
          render: (n) =>
            n.isPublished ? (
              <Badge variant="success">{tCommon("published")}</Badge>
            ) : (
              <Badge variant="neutral">{tCommon("draft")}</Badge>
            ),
        },
        {
          key: "updated",
          header: tCommon("updated"),
          render: (n) => (
            <span className="text-slate-500">
              {formatDate(n.updatedAt, toIntlLocale(locale))}
            </span>
          ),
        },
        {
          key: "actions",
          header: "",
          className: "w-24",
          render: (n) => (
            <div onClick={(e) => e.stopPropagation()}>
              <DeleteButton endpoint={`/api/admin/news/${n.id}`} label="" />
            </div>
          ),
        },
      ]}
    />
  );
}
