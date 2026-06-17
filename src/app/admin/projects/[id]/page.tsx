import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageProjects } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import ProjectForm from "@/components/admin/forms/ProjectForm";
import DeleteButton from "@/components/admin/DeleteButton";
import { getAdminTranslations } from "@/lib/admin-i18n";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageProjects(session.user.role)) redirect("/admin");

  const t = await getAdminTranslations("projects");
  const { id } = await params;
  const project = await prisma.project.findUnique({ where: { id } });

  if (!project) notFound();

  return (
    <>
      <AdminHeader title={t("editTitle")} user={session.user} />
      <main className="p-8 max-w-4xl">
        <PageHeader
          title={project.title}
          description={t("editDescription")}
          actions={
            <DeleteButton
              endpoint={`/api/admin/projects/${id}`}
              redirectTo="/admin/projects"
            />
          }
        />
        <ProjectForm
          initialData={{
            ...project,
            startDate: project.startDate?.toISOString() ?? null,
            endDate: project.endDate?.toISOString() ?? null,
          }}
        />
      </main>
    </>
  );
}
