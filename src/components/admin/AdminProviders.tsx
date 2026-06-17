"use client";

import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import type { Session } from "next-auth";
import type { AdminLocale } from "@/lib/admin-locale";

export default function AdminProviders({
  children,
  session,
  locale,
  messages,
}: {
  children: React.ReactNode;
  session: Session | null;
  locale: AdminLocale;
  messages: Record<string, unknown>;
}) {
  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Europe/Lisbon"
    >
      <SessionProvider session={session}>{children}</SessionProvider>
    </NextIntlClientProvider>
  );
}
