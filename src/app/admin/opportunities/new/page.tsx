import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageOpportunities } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import OpportunityForm from "@/components/admin/forms/OpportunityForm";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function NewOpportunityPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageOpportunities(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("opportunities");

  return (
    <>
      <AdminHeader title={t("newTitle")} user={session.user} />
      <main className="p-8 max-w-4xl">
        <PageHeader title={t("createTitle")} />
        <OpportunityForm />
      </main>
    </>
  );
}
