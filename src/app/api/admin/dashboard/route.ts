import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess } from "@/lib/api-auth";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

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
      include: {
        opportunity: { select: { title: true } },
      },
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

  return jsonSuccess({
    stats: {
      projects: { total: projectsCount, active: activeProjects },
      opportunities: { total: opportunitiesCount, open: openOpportunities },
      applications: { total: applicationsCount, pending: pendingApplications },
      news: newsCount,
      partners: partnersCount,
      gallery: galleryCount,
    },
    recentApplications,
    recentProjects,
    user: session!.user,
  });
}
