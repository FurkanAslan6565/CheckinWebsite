import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageNews } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import NewsForm from "@/components/admin/forms/NewsForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { getAdminTranslations } from "@/lib/admin-i18n";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditNewsPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageNews(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("news");
  const { id } = await params;
  const article = await prisma.news.findUnique({ where: { id } });

  if (!article) notFound();

  return (
    <>
      <AdminHeader title={t("editTitle")} user={session.user} />
      <main className="p-8 max-w-4xl">
        <PageHeader
          title={article.title}
          actions={
            <DeleteButton
              endpoint={`/api/admin/news/${id}`}
              redirectTo="/admin/news"
            />
          }
        />
        <NewsForm initialData={article} />
      </main>
    </>
  );
}
