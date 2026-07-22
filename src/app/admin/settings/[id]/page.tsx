import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageUsers } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import UserForm from "@/components/admin/forms/UserForm";
import { getAdminTranslations } from "@/lib/admin-i18n";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditUserPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageUsers(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("users");
  const { id } = await params;
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  });

  if (!user) notFound();

  return (
    <>
      <AdminHeader title={t("editTitle")} user={session.user} />
      <main className="p-8 max-w-2xl">
        <PageHeader title={user.name} />
        <UserForm initialData={user} currentUserRole={session.user.role} />
      </main>
    </>
  );
}
