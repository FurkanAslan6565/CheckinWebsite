"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslations } from "next-intl";

const TYPE_KEYS = [
  "EUROPEAN_INSTITUTION",
  "MUNICIPALITY",
  "UNIVERSITY",
  "NGO",
] as const;

interface PartnerFormProps {
  initialData?: {
    id?: string;
    name?: string;
    logoUrl?: string;
    websiteUrl?: string | null;
    type?: string;
    order?: number;
    isPublished?: boolean;
  };
}

export default function PartnerForm({ initialData }: PartnerFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;
  const t = useTranslations("admin.partners.form");
  const tPage = useTranslations("admin.partners");
  const tCommon = useTranslations("admin.common");
  const tTypes = useTranslations("admin.enums.partnerTypes");

  const TYPE_OPTIONS = TYPE_KEYS.map((value) => ({
    value,
    label: tTypes(value),
  }));

  const [form, setForm] = useState({
    name: initialData?.name || "",
    logoUrl: initialData?.logoUrl || "",
    websiteUrl: initialData?.websiteUrl || "",
    type: initialData?.type || "NGO",
    order: String(initialData?.order ?? 0),
    isPublished: initialData?.isPublished ?? true,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/partners/${initialData!.id}`
        : "/api/admin/partners";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          order: parseInt(form.order, 10) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || tCommon("saveError"));
      }

      router.push("/admin/partners");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : tCommon("saveError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card className="space-y-6">
        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label={t("name")}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Select
            label={t("type")}
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            options={TYPE_OPTIONS}
          />
          <Input
            label={t("logoUrl")}
            value={form.logoUrl}
            onChange={(e) => setForm({ ...form, logoUrl: e.target.value })}
            required
          />
          <Input
            label={t("website")}
            value={form.websiteUrl}
            onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
            placeholder={t("websitePlaceholder")}
          />
          <Input
            label={t("order")}
            type="number"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value })}
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) =>
              setForm({ ...form, isPublished: e.target.checked })
            }
            className="w-4 h-4 rounded border-slate-300 text-[hsl(var(--accent-blue))]"
          />
          <span className="text-sm font-medium text-slate-700">
            {tCommon("visibleOnSite")}
          </span>
        </label>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? tCommon("save") : tPage("createLabel")}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.back()}>
            {tCommon("cancel")}
          </Button>
        </div>
      </Card>
    </form>
  );
}
