import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManagePartners } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import PartnersTable from "@/components/admin/tables/PartnersTable";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function AdminPartnersPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManagePartners(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("partners");

  const partners = await prisma.partner.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <>
      <AdminHeader title={t("title")} user={session.user} />
      <main className="p-8">
        <PageHeader
          title={t("manageTitle")}
          description={t("manageDescription")}
          createHref="/admin/partners/new"
          createLabel={t("newTitle")}
        />
        <PartnersTable partners={partners} />
      </main>
    </>
  );
}
