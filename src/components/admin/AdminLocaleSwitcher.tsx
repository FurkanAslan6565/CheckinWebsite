"use client";

import { useTransition } from "react";
import { useLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { setAdminLocale } from "@/app/admin/actions/locale";
import { useRouter } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const LOCALE_LABELS: Record<string, string> = {
  pt: "PT",
  tr: "TR",
};

export default function AdminLocaleSwitcher({
  className,
  variant = "header",
}: {
  className?: string;
  variant?: "header" | "login";
}) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("admin.header");
  const tLocales = useTranslations("admin.locales");
  const [isPending, startTransition] = useTransition();

  function handleChange(nextLocale: string) {
    if (nextLocale === locale) return;

    startTransition(async () => {
      await setAdminLocale(nextLocale);
      router.refresh();
    });
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Globe
        className={cn(
          "w-4 h-4 shrink-0",
          variant === "login" ? "text-slate-400" : "text-slate-400"
        )}
        aria-hidden
      />
      <label className="sr-only" htmlFor="admin-locale">
        {t("language")}
      </label>
      <select
        id="admin-locale"
        value={locale}
        disabled={isPending}
        onChange={(e) => handleChange(e.target.value)}
        className={cn(
          "rounded-xl border text-sm font-medium transition-colors cursor-pointer",
          "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-blue))]/30",
          variant === "login"
            ? "bg-white/5 border-white/10 text-white px-3 py-2 hover:bg-white/10"
            : "bg-white border-slate-200 text-slate-700 px-3 py-1.5 hover:border-slate-300",
          isPending && "opacity-60"
        )}
        aria-label={t("language")}
      >
        {routing.locales.map((loc) => (
          <option
            key={loc}
            value={loc}
            className={variant === "login" ? "text-slate-900" : undefined}
          >
            {LOCALE_LABELS[loc]} — {tLocales(loc)}
          </option>
        ))}
      </select>
    </div>
  );
}
