import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canManagePartners } from "@/lib/permissions";
import type { PartnerType } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManagePartners(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const partner = await prisma.partner.findUnique({ where: { id } });

  if (!partner) {
    return jsonError("Parceiro não encontrado", 404);
  }

  return jsonSuccess(partner);
}

export async function PUT(request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManagePartners(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const body = await request.json();

  const partner = await prisma.partner.update({
    where: { id },
    data: {
      name: body.name,
      logoUrl: body.logoUrl,
      websiteUrl: body.websiteUrl,
      type: body.type as PartnerType,
      order: body.order,
      isPublished: body.isPublished,
    },
  });

  return jsonSuccess(partner);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManagePartners(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  await prisma.partner.delete({ where: { id } });
  return jsonSuccess({ success: true });
}
