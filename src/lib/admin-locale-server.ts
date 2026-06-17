import { cookies } from "next/headers";
import {
  ADMIN_LOCALE_COOKIE,
  type AdminLocale,
  isAdminLocale,
} from "@/lib/admin-locale";
import { routing } from "@/i18n/routing";

export async function getAdminLocale(): Promise<AdminLocale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(ADMIN_LOCALE_COOKIE)?.value;

  if (value && isAdminLocale(value)) {
    return value;
  }

  return routing.defaultLocale;
}

export async function getAdminMessages(locale: AdminLocale) {
  const [publicMessages, adminMessages] = await Promise.all([
    import(`../../messages/${locale}.json`).then((m) => m.default),
    import(`../../messages/admin/${locale}.json`).then((m) => m.default),
  ]);

  return { ...publicMessages, admin: adminMessages };
}
