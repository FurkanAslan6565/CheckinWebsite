import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManagePartners } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import PartnerForm from "@/components/admin/forms/PartnerForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { getAdminTranslations } from "@/lib/admin-i18n";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditPartnerPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManagePartners(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("partners");
  const { id } = await params;
  const partner = await prisma.partner.findUnique({ where: { id } });

  if (!partner) notFound();

  return (
    <>
      <AdminHeader title={t("editTitle")} user={session.user} />
      <main className="p-8 max-w-4xl">
        <PageHeader
          title={partner.name}
          actions={
            <DeleteButton
              endpoint={`/api/admin/partners/${id}`}
              redirectTo="/admin/partners"
            />
          }
        />
        <PartnerForm initialData={partner} />
      </main>
    </>
  );
}
