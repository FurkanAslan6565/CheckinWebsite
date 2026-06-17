import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageNews } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import NewsTable from "@/components/admin/tables/NewsTable";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function AdminNewsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageNews(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("news");

  const news = await prisma.news.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <>
      <AdminHeader title={t("title")} user={session.user} />
      <main className="p-8">
        <PageHeader
          title={t("manageTitle")}
          description={t("manageDescription")}
          createHref="/admin/news/new"
          createLabel={t("newTitle")}
        />
        <NewsTable
          news={news.map((n) => ({
            ...n,
            updatedAt: n.updatedAt.toISOString(),
          }))}
        />
      </main>
    </>
  );
}
