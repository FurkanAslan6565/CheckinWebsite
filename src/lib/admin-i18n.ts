import { getTranslations } from "next-intl/server";
import { getAdminLocale } from "@/lib/admin-locale-server";

export async function getAdminTranslations(namespace?: string) {
  const locale = await getAdminLocale();
  const ns = namespace ? (`admin.${namespace}` as const) : ("admin" as const);

  return getTranslations({ locale, namespace: ns });
}
