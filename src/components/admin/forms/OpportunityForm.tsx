"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslations } from "next-intl";

const TYPE_KEYS = ["VOLUNTEERING", "TRAINING_COURSE", "YOUTH_EXCHANGE"] as const;

interface OpportunityFormProps {
  initialData?: {
    id?: string;
    title?: string;
    type?: string;
    description?: string;
    requirements?: string;
    duration?: string;
    location?: string;
    deadline?: string;
    coverImageUrl?: string;
    isPublished?: boolean;
  };
}

export default function OpportunityForm({ initialData }: OpportunityFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;
  const t = useTranslations("admin.opportunities.form");
  const tPage = useTranslations("admin.opportunities");
  const tCommon = useTranslations("admin.common");
  const tTypes = useTranslations("admin.enums.opportunityTypes");

  const TYPE_OPTIONS = TYPE_KEYS.map((value) => ({
    value,
    label: tTypes(value),
  }));

  const [form, setForm] = useState({
    title: initialData?.title || "",
    type: initialData?.type || "VOLUNTEERING",
    description: initialData?.description || "",
    requirements: initialData?.requirements || "",
    duration: initialData?.duration || "",
    location: initialData?.location || "",
    deadline: initialData?.deadline
      ? new Date(initialData.deadline).toISOString().split("T")[0]
      : "",
    coverImageUrl: initialData?.coverImageUrl || "",
    isPublished: initialData?.isPublished ?? false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/opportunities/${initialData!.id}`
        : "/api/admin/opportunities";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || tCommon("saveError"));
      }

      router.push("/admin/opportunities");
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
            label={t("title")}
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            required
          />
          <Select
            label={t("type")}
            value={form.type}
            onChange={(e) => update("type", e.target.value)}
            options={TYPE_OPTIONS}
          />
          <Input
            label={t("location")}
            value={form.location}
            onChange={(e) => update("location", e.target.value)}
            required
          />
          <Input
            label={t("duration")}
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
            required
          />
          <Input
            label={t("deadline")}
            type="date"
            value={form.deadline}
            onChange={(e) => update("deadline", e.target.value)}
            required
          />
          <Input
            label={t("coverImageUrl")}
            value={form.coverImageUrl}
            onChange={(e) => update("coverImageUrl", e.target.value)}
            required
          />
        </div>

        <Textarea
          label={t("description")}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
          className="min-h-[140px]"
        />

        <Textarea
          label={t("requirements")}
          value={form.requirements}
          onChange={(e) => update("requirements", e.target.value)}
          required
          className="min-h-[120px]"
        />

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[hsl(var(--accent-blue))]"
          />
          <span className="text-sm font-medium text-slate-700">
            {tCommon("publishOnSite")}
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
