import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { slugify } from "@/lib/slug";
import { canManageProjects } from "@/lib/permissions";
import type { FundingProgram, ProjectStatus } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageProjects(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { author: { select: { name: true } } },
  });

  if (!project) {
    return jsonError("Projeto não encontrado", 404);
  }

  return jsonSuccess(project);
}

export async function PUT(request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageProjects(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const body = await request.json();

  const existing = await prisma.project.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Projeto não encontrado", 404);
  }

  let slug = existing.slug;
  if (body.title && body.title !== existing.title) {
    slug = slugify(body.title);
    const slugConflict = await prisma.project.findFirst({
      where: { slug, NOT: { id } },
    });
    if (slugConflict) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const project = await prisma.project.update({
    where: { id },
    data: {
      title: body.title,
      slug,
      description: body.description,
      results: body.results,
      coverImageUrl: body.coverImageUrl,
      galleryImages: body.galleryImages,
      country: body.country,
      duration: body.duration,
      startDate: body.startDate ? new Date(body.startDate) : null,
      endDate: body.endDate ? new Date(body.endDate) : null,
      program: body.program as FundingProgram,
      status: body.status as ProjectStatus,
      isPublished: body.isPublished,
    },
  });

  return jsonSuccess(project);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageProjects(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;

  await prisma.project.delete({ where: { id } });
  return jsonSuccess({ success: true });
}
