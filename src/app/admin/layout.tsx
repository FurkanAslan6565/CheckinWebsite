import { auth } from "@/lib/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminProviders from "@/components/admin/AdminProviders";
import { getAdminLocale, getAdminMessages } from "@/lib/admin-locale-server";
import { getAdminTranslations } from "@/lib/admin-i18n";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getAdminTranslations("meta");

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const locale = await getAdminLocale();
  const messages = await getAdminMessages(locale);

  return (
    <AdminProviders session={session} locale={locale} messages={messages}>
      <div className="admin-panel min-h-screen bg-[#FAFAFC]">
        {session?.user && <AdminSidebar role={session.user.role} />}
        <div className={session?.user ? "ml-64 min-h-screen" : ""}>
          {children}
        </div>
      </div>
    </AdminProviders>
  );
}
