"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import DeleteButton from "@/components/admin/DeleteButton";
import { Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import { useLocale, useTranslations } from "next-intl";
import { toIntlLocale, type AdminLocale } from "@/lib/admin-locale";

interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  cloudinaryId: string;
  bytes: number;
  mimeType: string;
  createdAt: string;
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibrary({
  initialAssets,
}: {
  initialAssets: MediaAsset[];
}) {
  const router = useRouter();
  const locale = useLocale() as AdminLocale;
  const t = useTranslations("admin.media");
  const tCommon = useTranslations("admin.common");

  const [assets, setAssets] = useState(initialAssets);
  const [form, setForm] = useState({
    filename: "",
    url: "",
    cloudinaryId: "",
    bytes: "0",
    mimeType: "image/jpeg",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          bytes: parseInt(form.bytes, 10) || 0,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || t("uploadError"));
      }

      const asset = await res.json();
      setAssets([asset, ...assets]);
      setForm({
        filename: "",
        url: "",
        cloudinaryId: "",
        bytes: "0",
        mimeType: "image/jpeg",
      });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("uploadError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-blue-50">
            <Upload className="w-5 h-5 text-[hsl(var(--accent-blue))]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">
              {t("registerTitle")}
            </h3>
            <p className="text-sm text-slate-500">{t("registerDescription")}</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label={t("form.filename")}
              value={form.filename}
              onChange={(e) => setForm({ ...form, filename: e.target.value })}
              required
            />
            <Input
              label={t("form.url")}
              value={form.url}
              onChange={(e) => setForm({ ...form, url: e.target.value })}
              required
            />
            <Input
              label={t("form.cloudinaryId")}
              value={form.cloudinaryId}
              onChange={(e) =>
                setForm({ ...form, cloudinaryId: e.target.value })
              }
              required
            />
            <Input
              label={t("form.mimeType")}
              value={form.mimeType}
              onChange={(e) => setForm({ ...form, mimeType: e.target.value })}
            />
          </div>
          <Button type="submit" isLoading={isLoading}>
            {t("registerButton")}
          </Button>
        </form>
      </Card>

      {assets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500">{t("empty")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="group bg-white rounded-xl border border-slate-200 overflow-hidden"
            >
              <div className="aspect-square relative bg-slate-50">
                {asset.mimeType.startsWith("image/") ? (
                  <Image
                    src={asset.url}
                    alt={asset.filename}
                    fill
                    className="object-cover"
                    sizes="200px"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="text-xs font-medium text-slate-900 truncate">
                  {asset.filename}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {formatBytes(asset.bytes)} ·{" "}
                  {formatDate(asset.createdAt, toIntlLocale(locale))}
                </p>
              </div>
              <div className="px-3 pb-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <DeleteButton
                  endpoint={`/api/admin/media?id=${asset.id}`}
                  label={tCommon("remove")}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
