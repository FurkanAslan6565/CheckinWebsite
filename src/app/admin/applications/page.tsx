import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canViewApplications } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import ApplicationsTable from "@/components/admin/tables/ApplicationsTable";
import { getAdminTranslations } from "@/lib/admin-i18n";
import { getSubmissions } from "@/lib/storage";

export default async function AdminApplicationsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canViewApplications(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("applications");

  // Read local submissions
  const submissions = getSubmissions();

  const formattedApplications = submissions.map((s) => ({
    id: s.id,
    firstName: s.firstName,
    lastName: s.lastName,
    email: s.email,
    phone: s.phone,
    birthDate: s.birthDate,
    motivation: s.motivation,
    cvUrl: s.cvUrl || null,
    status: s.status,
    createdAt: s.createdAt,
    answers: s.answers || {},
    opportunity: {
      title: s.opportunityTitle,
      slug: s.opportunityId,
    },
  }));

  return (
    <>
      <AdminHeader title={t("title")} user={session.user} />
      <main className="p-8">
        <PageHeader
          title={t("manageTitle")}
          description={t("manageDescription")}
        />
        <ApplicationsTable applications={formattedApplications} />
      </main>
    </>
  );
}
