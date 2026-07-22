import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { slugify } from "@/lib/slug";
import { canManageProjects } from "@/lib/permissions";
import type { FundingProgram, ProjectStatus } from "@prisma/client";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageProjects(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const projects = await prisma.project.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      author: { select: { name: true } },
    },
  });

  return jsonSuccess(projects);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageProjects(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const body = await request.json();
  const {
    title,
    description,
    results,
    coverImageUrl,
    galleryImages,
    country,
    duration,
    startDate,
    endDate,
    program,
    status,
    isPublished,
  } = body;

  if (!title || !description || !coverImageUrl || !country || !duration || !program) {
    return jsonError("Campos obrigatórios em falta");
  }

  let slug = slugify(title);
  const existing = await prisma.project.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const project = await prisma.project.create({
    data: {
      title,
      slug,
      description,
      results: results || null,
      coverImageUrl,
      galleryImages: galleryImages || [],
      country,
      duration,
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      program: program as FundingProgram,
      status: (status as ProjectStatus) || "DRAFT",
      isPublished: isPublished ?? false,
      authorId: session!.user.id,
    },
  });

  return jsonSuccess(project, 201);
}
