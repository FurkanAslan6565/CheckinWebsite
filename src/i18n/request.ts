import { getRequestConfig } from "next-intl/server";
import { cookies } from "next/headers";
import { routing } from "./routing";
import {
  ADMIN_LOCALE_COOKIE,
  isAdminLocale,
  type AdminLocale,
} from "@/lib/admin-locale";

async function loadMessages(locale: AdminLocale) {
  const [publicMessages, adminMessages] = await Promise.all([
    import(`../../messages/${locale}.json`).then((m) => m.default),
    import(`../../messages/admin/${locale}.json`).then((m) => m.default),
  ]);

  return { ...publicMessages, admin: adminMessages };
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (
    !locale ||
    !routing.locales.includes(locale as (typeof routing.locales)[number])
  ) {
    const cookieStore = await cookies();
    const adminLocale = cookieStore.get(ADMIN_LOCALE_COOKIE)?.value;

    if (adminLocale && isAdminLocale(adminLocale)) {
      locale = adminLocale;
    } else {
      locale = routing.defaultLocale;
    }
  }

  return {
    locale,
    messages: await loadMessages(locale as AdminLocale),
    timeZone: "Europe/Lisbon",
  };
});
