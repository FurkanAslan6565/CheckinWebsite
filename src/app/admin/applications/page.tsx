import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canViewApplications } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import ApplicationsTable from "@/components/admin/tables/ApplicationsTable";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function AdminApplicationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canViewApplications(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("applications");

  const applications = await prisma.application.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      opportunity: { select: { title: true, slug: true } },
    },
  });

  return (
    <>
      <AdminHeader title={t("title")} user={session.user} />
      <main className="p-8">
        <PageHeader
          title={t("manageTitle")}
          description={t("manageDescription")}
        />
        <ApplicationsTable
          applications={applications.map((a) => ({
            ...a,
            createdAt: a.createdAt.toISOString(),
          }))}
        />
      </main>
    </>
  );
}
