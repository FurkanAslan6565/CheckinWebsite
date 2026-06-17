import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { slugify } from "@/lib/slug";
import { canManageOpportunities } from "@/lib/permissions";
import type { OpportunityType } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageOpportunities(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const opportunity = await prisma.opportunity.findUnique({
    where: { id },
    include: {
      author: { select: { name: true } },
      _count: { select: { applications: true } },
    },
  });

  if (!opportunity) {
    return jsonError("Oportunidade não encontrada", 404);
  }

  return jsonSuccess(opportunity);
}

export async function PUT(request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageOpportunities(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const body = await request.json();

  const existing = await prisma.opportunity.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Oportunidade não encontrada", 404);
  }

  let slug = existing.slug;
  if (body.title && body.title !== existing.title) {
    slug = slugify(body.title);
    const slugConflict = await prisma.opportunity.findFirst({
      where: { slug, NOT: { id } },
    });
    if (slugConflict) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const opportunity = await prisma.opportunity.update({
    where: { id },
    data: {
      title: body.title,
      slug,
      type: body.type as OpportunityType,
      description: body.description,
      requirements: body.requirements,
      duration: body.duration,
      location: body.location,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
      coverImageUrl: body.coverImageUrl,
      isPublished: body.isPublished,
    },
  });

  return jsonSuccess(opportunity);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageOpportunities(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  await prisma.opportunity.delete({ where: { id } });
  return jsonSuccess({ success: true });
}
