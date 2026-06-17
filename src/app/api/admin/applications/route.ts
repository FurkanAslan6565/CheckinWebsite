import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canViewApplications } from "@/lib/permissions";

export async function GET(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canViewApplications(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { searchParams } = new URL(request.url);
  const opportunityId = searchParams.get("opportunityId");
  const status = searchParams.get("status");

  const applications = await prisma.application.findMany({
    where: {
      ...(opportunityId ? { opportunityId } : {}),
      ...(status ? { status } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: {
      opportunity: { select: { title: true, slug: true } },
    },
  });

  return jsonSuccess(applications);
}
