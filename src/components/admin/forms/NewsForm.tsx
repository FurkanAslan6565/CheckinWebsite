"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useTranslations } from "next-intl";

interface NewsFormProps {
  initialData?: {
    id?: string;
    title?: string;
    content?: string;
    coverImageUrl?: string;
    isPublished?: boolean;
  };
}

export default function NewsForm({ initialData }: NewsFormProps) {
  const router = useRouter();
  const isEditing = !!initialData?.id;
  const t = useTranslations("admin.news.form");
  const tPage = useTranslations("admin.news");
  const tCommon = useTranslations("admin.common");

  const [form, setForm] = useState({
    title: initialData?.title || "",
    content: initialData?.content || "",
    coverImageUrl: initialData?.coverImageUrl || "",
    isPublished: initialData?.isPublished ?? false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const url = isEditing
        ? `/api/admin/news/${initialData!.id}`
        : "/api/admin/news";
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

      router.push("/admin/news");
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

        <Input
          label={t("title")}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />

        <Input
          label={t("coverImageUrl")}
          value={form.coverImageUrl}
          onChange={(e) => setForm({ ...form, coverImageUrl: e.target.value })}
          required
        />

        <Textarea
          label={t("content")}
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          required
          className="min-h-[300px]"
          hint={t("contentHint")}
        />

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
