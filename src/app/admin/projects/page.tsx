import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { canManageProjects } from "@/lib/permissions";
import AdminHeader from "@/components/admin/AdminHeader";
import PageHeader from "@/components/admin/PageHeader";
import ProjectsTable from "@/components/admin/tables/ProjectsTable";
import { getAdminTranslations } from "@/lib/admin-i18n";
import { getAdminLocale } from "@/lib/admin-locale-server";
import { ExternalLink } from "lucide-react";

export default async function AdminProjectsPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");
  if (!canManageProjects(session.user.role)) redirect("/admin");

  const locale = await getAdminLocale();
  const t = await getAdminTranslations("projects");
  const tHeader = await getAdminTranslations("header");

  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <>
      <AdminHeader title={t("title")} user={session.user} />
      <main className="p-8">
        <PageHeader
          title={t("manageTitle")}
          description={t("manageDescription")}
          createHref="/admin/projects/new"
          createLabel={t("newTitle")}
          actions={
            <a
              href={`/${locale}/projects`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:text-[hsl(var(--accent-blue))] hover:border-[hsl(var(--accent-blue))]/30 hover:bg-slate-50 rounded-xl text-sm font-semibold transition-all shadow-sm"
            >
              <ExternalLink className="w-4 h-4" />
              {tHeader("viewSite")}
            </a>
          }
        />
        <ProjectsTable
          projects={projects.map((p) => ({
            ...p,
            updatedAt: p.updatedAt.toISOString(),
          }))}
        />
      </main>
    </>
  );
}
