import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageOpportunities } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import OpportunitiesTable from "@/components/admin/tables/OpportunitiesTable";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function AdminOpportunitiesPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageOpportunities(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("opportunities");

  const opportunities = await prisma.opportunity.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { applications: true } },
    },
  });

  return (
    <>
      <AdminHeader title={t("title")} user={session.user} />
      <main className="p-8">
        <PageHeader
          title={t("manageTitle")}
          description={t("manageDescription")}
          createHref="/admin/opportunities/new"
          createLabel={t("newTitle")}
        />
        <OpportunitiesTable
          opportunities={opportunities.map((o) => ({
            ...o,
            deadline: o.deadline.toISOString(),
          }))}
        />
      </main>
    </>
  );
}
