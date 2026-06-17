"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslations } from "next-intl";

const PROGRAM_KEYS = [
  "ERASMUS_PLUS",
  "ESC",
  "YOUTH_EXCHANGE",
  "TRAINING_COURSE",
  "KA1",
  "KA2",
  "YOUTH_PARTICIPATION",
  "CERV",
] as const;

const STATUS_KEYS = ["DRAFT", "ACTIVE", "COMPLETED"] as const;

interface ProjectFormProps {
  initialData?: {
    id?: string;
    title?: string;
    description?: string;
    results?: string | null;
    coverImageUrl?: string;
    galleryImages?: string[];
    country?: string;
    duration?: string;
    startDate?: string | null;
    endDate?: string | null;
    program?: string;
    status?: string;
    isPublished?: boolean;
  };
}

export default function ProjectForm({ initialData }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;
  const t = useTranslations("admin.projects.form");
  const tPage = useTranslations("admin.projects");
  const tCommon = useTranslations("admin.common");
  const tEnums = useTranslations("admin.enums.programs");
  const tStatus = useTranslations("admin.status.project");

  const PROGRAM_OPTIONS = PROGRAM_KEYS.map((value) => ({
    value,
    label: tEnums(value),
  }));

  const STATUS_OPTIONS = STATUS_KEYS.map((value) => ({
    value,
    label: tStatus(value),
  }));

  const [form, setForm] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    results: initialData?.results || "",
    coverImageUrl: initialData?.coverImageUrl || "",
    galleryImages: (initialData?.galleryImages || []).join("\n"),
    country: initialData?.country || "",
    duration: initialData?.duration || "",
    startDate: initialData?.startDate
      ? new Date(initialData.startDate).toISOString().split("T")[0]
      : "",
    endDate: initialData?.endDate
      ? new Date(initialData.endDate).toISOString().split("T")[0]
      : "",
    program: initialData?.program || "ERASMUS_PLUS",
    status: initialData?.status || "DRAFT",
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

    const payload = {
      ...form,
      galleryImages: form.galleryImages
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      startDate: form.startDate || null,
      endDate: form.endDate || null,
    };

    try {
      const url = isEditing
        ? `/api/admin/projects/${initialData!.id}`
        : "/api/admin/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || tCommon("saveError"));
      }

      router.push("/admin/projects");
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
          <Input
            label={t("country")}
            value={form.country}
            onChange={(e) => update("country", e.target.value)}
            required
          />
          <Input
            label={t("duration")}
            value={form.duration}
            onChange={(e) => update("duration", e.target.value)}
            placeholder={t("durationPlaceholder")}
            required
          />
          <Select
            label={t("program")}
            value={form.program}
            onChange={(e) => update("program", e.target.value)}
            options={PROGRAM_OPTIONS}
          />
          <Select
            label={t("status")}
            value={form.status}
            onChange={(e) => update("status", e.target.value)}
            options={STATUS_OPTIONS}
          />
          <Input
            label={t("startDate")}
            type="date"
            value={form.startDate}
            onChange={(e) => update("startDate", e.target.value)}
          />
          <Input
            label={t("endDate")}
            type="date"
            value={form.endDate}
            onChange={(e) => update("endDate", e.target.value)}
          />
          <Input
            label={t("coverImageUrl")}
            value={form.coverImageUrl}
            onChange={(e) => update("coverImageUrl", e.target.value)}
            placeholder={t("coverImagePlaceholder")}
            required
          />
        </div>

        <Textarea
          label={t("description")}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          required
          className="min-h-[160px]"
        />

        <Textarea
          label={t("results")}
          value={form.results}
          onChange={(e) => update("results", e.target.value)}
          hint={t("resultsHint")}
        />

        <Textarea
          label={t("galleryUrls")}
          value={form.galleryImages}
          onChange={(e) => update("galleryImages", e.target.value)}
          className="min-h-[100px]"
        />

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-[hsl(var(--accent-blue))] focus:ring-[hsl(var(--accent-blue))]"
          />
          <span className="text-sm font-medium text-slate-700">
            {tCommon("publishOnSite")}
          </span>
        </label>

        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
          <Button type="submit" isLoading={isLoading}>
            {isEditing ? tCommon("save") : tPage("createLabel")}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            {tCommon("cancel")}
          </Button>
        </div>
      </Card>
    </form>
  );
}
