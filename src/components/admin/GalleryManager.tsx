"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import DeleteButton from "@/components/admin/DeleteButton";
import Image from "next/image";
import { useTranslations } from "next-intl";

const CATEGORY_KEYS = ["General", "Erasmus+", "ESC", "Team", "Events"] as const;

interface GalleryItem {
  id: string;
  title: string | null;
  url: string;
  isVideo: boolean;
  category: string;
  createdAt: string;
}

export default function GalleryManager({
  initialItems,
}: {
  initialItems: GalleryItem[];
}) {
  const router = useRouter();
  const t = useTranslations("admin.gallery");
  const tCommon = useTranslations("admin.common");
  const tCategories = useTranslations("admin.enums.galleryCategories");

  const CATEGORY_OPTIONS = CATEGORY_KEYS.map((value) => ({
    value,
    label: tCategories(value),
  }));

  const [items, setItems] = useState(initialItems);
  const [form, setForm] = useState({
    title: "",
    url: "",
    isVideo: false,
    category: "General",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("addError"));
      }

      const item = await res.json();
      setItems([item, ...items]);
      setForm({ title: "", url: "", isVideo: false, category: "General" });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("addError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">
          {t("addTitle")}
        </h3>
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("form.titleOptional")}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              label={t("form.url")}
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              placeholder="https://..."
              required
            />
            <Select
              label={t("form.category")}
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              options={CATEGORY_OPTIONS}
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.isVideo}
              onChange={(e) =>
                setForm({ ...form, isVideo: e.target.checked })
              }
              className="w-4 h-4 rounded"
            />
            <span className="text-sm text-slate-700">{t("form.isVideo")}</span>
          </label>
          <Button type="submit" isLoading={isLoading}>
            {t("addButton")}
          </Button>
        </form>
      </Card>

      {items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <p className="text-slate-500">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="aspect-square relative bg-slate-100">
                {item.isVideo ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80">
                    <span className="text-white text-xs font-medium">
                      {tCommon("video")}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={item.url}
                    alt={item.title || tCommon("noTitle")}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {item.title || tCommon("noTitle")}
                </p>
                <p className="text-xs text-slate-500">
                  {CATEGORY_KEYS.includes(item.category as (typeof CATEGORY_KEYS)[number])
                    ? tCategories(item.category as "General")
                    : item.category}
                </p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteButton
                  endpoint={`/api/admin/gallery/${item.id}`}
                  label=""
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
