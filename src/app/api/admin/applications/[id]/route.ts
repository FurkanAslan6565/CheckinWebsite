import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canManageApplications } from "@/lib/permissions";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageApplications(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const application = await prisma.application.findUnique({
    where: { id },
    include: {
      opportunity: { select: { title: true, slug: true, type: true } },
    },
  });

  if (!application) {
    return jsonError("Candidatura não encontrada", 404);
  }

  return jsonSuccess(application);
}

export async function PATCH(request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageApplications(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const body = await request.json();

  if (!body.status || !["PENDING", "ACCEPTED", "REJECTED"].includes(body.status)) {
    return jsonError("Estado inválido");
  }

  const application = await prisma.application.update({
    where: { id },
    data: { status: body.status },
  });

  return jsonSuccess(application);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageApplications(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  await prisma.application.delete({ where: { id } });
  return jsonSuccess({ success: true });
}
