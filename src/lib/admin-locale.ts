import { routing } from "@/i18n/routing";

export const ADMIN_LOCALE_COOKIE = "admin-locale";

export type AdminLocale = (typeof routing.locales)[number];

export function toIntlLocale(locale: AdminLocale): string {
  const map: Record<AdminLocale, string> = {
    pt: "pt-PT",
    tr: "tr-TR",
  };

  return map[locale];
}

export function isAdminLocale(value: string): value is AdminLocale {
  return routing.locales.includes(value as AdminLocale);
}
