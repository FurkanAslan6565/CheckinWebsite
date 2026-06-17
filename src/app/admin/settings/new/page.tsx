import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageUsers } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import UserForm from "@/components/admin/forms/UserForm";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function NewUserPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageUsers(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("users");

  return (
    <>
      <AdminHeader title={t("newTitle")} user={session.user} />
      <main className="p-8 max-w-2xl">
        <PageHeader title={t("createTitle")} />
        <UserForm currentUserRole={session.user.role} />
      </main>
    </>
  );
}
