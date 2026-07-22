"use client";

import DataTable from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/Badge";
import { useRouter } from "next/navigation";
import DeleteButton from "@/components/admin/DeleteButton";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Partner {
  id: string;
  name: string;
  logoUrl: string;
  type: string;
  order: number;
  isPublished: boolean;
}

export default function PartnersTable({ partners }: { partners: Partner[] }) {
  const router = useRouter();
  const t = useTranslations("admin.partners");
  const tCommon = useTranslations("admin.common");
  const tTypes = useTranslations("admin.enums.partnerTypesShort");

  return (
    <DataTable
      data={partners}
      keyExtractor={(p) => p.id}
      onRowClick={(p) => router.push(`/admin/partners/${p.id}`)}
      emptyMessage={t("empty")}
      columns={[
        {
          key: "logo",
          header: t("table.logo"),
          className: "w-16",
          render: (p) => (
            <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden">
              {p.logoUrl ? (
                <Image
                  src={p.logoUrl}
                  alt={p.name}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              ) : (
                <span className="text-xs text-slate-400">—</span>
              )}
            </div>
          ),
        },
        {
          key: "name",
          header: t("table.name"),
          render: (p) => (
            <p className="font-medium text-slate-900">{p.name}</p>
          ),
        },
        {
          key: "type",
          header: t("table.type"),
          render: (p) => (
            <Badge variant="info">
              {tTypes(p.type as "NGO")}
            </Badge>
          ),
        },
        {
          key: "order",
          header: t("table.order"),
          render: (p) => (
            <span className="text-slate-500">{p.order}</span>
          ),
        },
        {
          key: "status",
          header: tCommon("status"),
          render: (p) =>
            p.isPublished ? (
              <Badge variant="success">{tCommon("visible")}</Badge>
            ) : (
              <Badge variant="neutral">{tCommon("hidden")}</Badge>
            ),
        },
        {
          key: "actions",
          header: "",
          className: "w-24",
          render: (p) => (
            <div onClick={(e) => e.stopPropagation()}>
              <DeleteButton
                endpoint={`/api/admin/partners/${p.id}`}
                label=""
              />
            </div>
          ),
        },
      ]}
    />
  );
}
