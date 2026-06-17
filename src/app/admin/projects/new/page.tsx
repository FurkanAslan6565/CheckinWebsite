import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { canManageProjects } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import ProjectForm from "@/components/admin/forms/ProjectForm";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function NewProjectPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageProjects(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("projects");

  return (
    <>
      <AdminHeader title={t("newTitle")} user={session.user} />
      <main className="p-8 max-w-4xl">
        <PageHeader
          title={t("createTitle")}
          description={t("createDescription")}
        />
        <ProjectForm />
      </main>
    </>
  );
}
