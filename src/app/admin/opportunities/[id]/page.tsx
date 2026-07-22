import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageOpportunities } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import OpportunityForm from "@/components/admin/forms/OpportunityForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { getAdminTranslations } from "@/lib/admin-i18n";
import FormBuilder from "@/components/admin/FormBuilder";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditOpportunityPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageOpportunities(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("opportunities");
  const { id } = await params;
  const opportunity = await prisma.opportunity.findUnique({ where: { id } });

  if (!opportunity) notFound();

  return (
    <>
      <AdminHeader title={t("editTitle")} user={session.user} />
      <main className="p-8 max-w-4xl">
        <PageHeader
          title={opportunity.title}
          actions={
            <DeleteButton
              endpoint={`/api/admin/opportunities/${id}`}
              redirectTo="/admin/opportunities"
            />
          }
        />
        <OpportunityForm
          initialData={{
            ...opportunity,
            deadline: opportunity.deadline.toISOString(),
          }}
        />
        <FormBuilder opportunityId={id} />
      </main>
    </>
  );
}

