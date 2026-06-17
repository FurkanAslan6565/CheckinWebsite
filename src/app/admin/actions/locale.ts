"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { ADMIN_LOCALE_COOKIE, isAdminLocale } from "@/lib/admin-locale";

export async function setAdminLocale(locale: string) {
  if (!isAdminLocale(locale)) {
    return { success: false };
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  revalidatePath("/admin", "layout");
  return { success: true };
}
