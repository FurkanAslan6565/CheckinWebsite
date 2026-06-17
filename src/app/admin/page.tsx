import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminHeader from "@/components/admin/AdminHeader";
import StatCard from "@/components/admin/StatCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatDateTime } from "@/lib/utils";
import Link from "next/link";
import {
  FolderKanban,
  Briefcase,
  ClipboardList,
  FileText,
  Users,
  Images,
} from "lucide-react";
import { toIntlLocale } from "@/lib/admin-locale";
import { getAdminLocale } from "@/lib/admin-locale-server";
import { getAdminTranslations } from "@/lib/admin-i18n";

export default async function AdminDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/admin/login");

  const locale = await getAdminLocale();
  const intlLocale = toIntlLocale(locale);
  const t = await getAdminTranslations("dashboard");
  const tCommon = await getAdminTranslations("common");
  const tStatus = await getAdminTranslations("status");

  const [
    projectsCount,
    activeProjects,
    opportunitiesCount,
    openOpportunities,
    applicationsCount,
    pendingApplications,
    newsCount,
    partnersCount,
    galleryCount,
    recentApplications,
    recentProjects,
  ] = await Promise.all([
    prisma.project.count(),
    prisma.project.count({ where: { status: "ACTIVE", isPublished: true } }),
    prisma.opportunity.count(),
    prisma.opportunity.count({
      where: { isPublished: true, deadline: { gte: new Date() } },
    }),
    prisma.application.count(),
    prisma.application.count({ where: { status: "PENDING" } }),
    prisma.news.count(),
    prisma.partner.count({ where: { isPublished: true } }),
    prisma.galleryItem.count(),
    prisma.application.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { opportunity: { select: { title: true } } },
    }),
    prisma.project.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        isPublished: true,
        updatedAt: true,
      },
    }),
  ]);

  const statusVariant = (status: string) => {
    if (status === "ACTIVE") return "success" as const;
    if (status === "DRAFT") return "warning" as const;
    return "neutral" as const;
  };

  const appStatusVariant = (status: string) => {
    if (status === "ACCEPTED") return "success" as const;
    if (status === "REJECTED") return "danger" as const;
    return "warning" as const;
  };

  return (
    <>
      <AdminHeader
        title={t("title")}
        description={t("welcome", { name: session.user.name ?? "" })}
        user={session.user}
      />

      <main className="p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <StatCard
            title={t("stats.projects")}
            value={projectsCount}
            change={t("stats.projectsActive", { count: activeProjects })}
            icon={FolderKanban}
            iconColor="bg-blue-50 text-[hsl(var(--accent-blue))]"
          />
          <StatCard
            title={t("stats.opportunities")}
            value={opportunitiesCount}
            change={t("stats.opportunitiesOpen", { count: openOpportunities })}
            icon={Briefcase}
            iconColor="bg-indigo-50 text-indigo-600"
          />
          <StatCard
            title={t("stats.applications")}
            value={applicationsCount}
            change={t("stats.applicationsPending", {
              count: pendingApplications,
            })}
            changeType={pendingApplications > 0 ? "negative" : "neutral"}
            icon={ClipboardList}
            iconColor="bg-amber-50 text-amber-600"
          />
          <StatCard
            title={t("stats.news")}
            value={newsCount}
            icon={FileText}
            iconColor="bg-emerald-50 text-emerald-600"
          />
          <StatCard
            title={t("stats.partners")}
            value={partnersCount}
            icon={Users}
            iconColor="bg-violet-50 text-violet-600"
          />
          <StatCard
            title={t("stats.gallery")}
            value={galleryCount}
            icon={Images}
            iconColor="bg-rose-50 text-rose-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader
              title={t("recentApplications.title")}
              description={t("recentApplications.description")}
              action={
                <Link
                  href="/admin/applications"
                  className="text-sm text-[hsl(var(--accent-blue))] hover:underline"
                >
                  {tCommon("viewAll")}
                </Link>
              }
            />
            {recentApplications.length === 0 ? (
              <p className="text-sm text-slate-500">
                {t("recentApplications.empty")}
              </p>
            ) : (
              <div className="space-y-3">
                {recentApplications.map((app) => (
                  <Link
                    key={app.id}
                    href="/admin/applications"
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {app.firstName} {app.lastName}
                      </p>
                      <p className="text-xs text-slate-500">
                        {app.opportunity.title}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant={appStatusVariant(app.status)}>
                        {tStatus(`application.${app.status}`)}
                      </Badge>
                      <p className="text-xs text-slate-400 mt-1">
                        {formatDate(app.createdAt, intlLocale)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <CardHeader
              title={t("recentProjects.title")}
              description={t("recentProjects.description")}
              action={
                <Link
                  href="/admin/projects"
                  className="text-sm text-[hsl(var(--accent-blue))] hover:underline"
                >
                  {tCommon("viewAllMasc")}
                </Link>
              }
            />
            {recentProjects.length === 0 ? (
              <p className="text-sm text-slate-500">
                {t("recentProjects.empty")}
              </p>
            ) : (
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/admin/projects/${project.id}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-900">
                        {project.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        {formatDateTime(project.updatedAt, intlLocale)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={statusVariant(project.status)}>
                        {tStatus(`project.${project.status}`)}
                      </Badge>
                      {project.isPublished && (
                        <Badge variant="success">{tCommon("published")}</Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </>
  );
}
