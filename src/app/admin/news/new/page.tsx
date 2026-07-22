import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageNews } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import NewsForm from "@/components/admin/forms/NewsForm";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function NewNewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageNews(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("news");

  return (
    <>
      <AdminHeader title={t("newTitle")} user={session.user} />
      <main className="p-8 max-w-4xl">
        <PageHeader title={t("createTitle")} />
        <NewsForm />
      </main>
    </>
  );
}
