import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { slugify } from "@/lib/slug";
import { canManageOpportunities } from "@/lib/permissions";
import type { OpportunityType } from "@prisma/client";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageOpportunities(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const opportunities = await prisma.opportunity.findMany({
    orderBy: { updatedAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { applications: true } },
    },
  });

  return jsonSuccess(opportunities);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageOpportunities(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const body = await request.json();
  const {
    title,
    type,
    description,
    requirements,
    duration,
    location,
    deadline,
    coverImageUrl,
    isPublished,
  } = body;

  if (
    !title ||
    !type ||
    !description ||
    !requirements ||
    !duration ||
    !location ||
    !deadline ||
    !coverImageUrl
  ) {
    return jsonError("Campos obrigatórios em falta");
  }

  let slug = slugify(title);
  const existing = await prisma.opportunity.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const opportunity = await prisma.opportunity.create({
    data: {
      title,
      slug,
      type: type as OpportunityType,
      description,
      requirements,
      duration,
      location,
      deadline: new Date(deadline),
      coverImageUrl,
      isPublished: isPublished ?? false,
      authorId: session!.user.id,
    },
  });

  return jsonSuccess(opportunity, 201);
}
