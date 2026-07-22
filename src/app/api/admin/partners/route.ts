import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canManagePartners } from "@/lib/permissions";
import type { PartnerType } from "@prisma/client";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManagePartners(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const partners = await prisma.partner.findMany({
    orderBy: { order: "asc" },
  });

  return jsonSuccess(partners);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManagePartners(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const body = await request.json();
  const { name, logoUrl, websiteUrl, type, order, isPublished } = body;

  if (!name || !logoUrl || !type) {
    return jsonError("Campos obrigatórios em falta");
  }

  const partner = await prisma.partner.create({
    data: {
      name,
      logoUrl,
      websiteUrl: websiteUrl || null,
      type: type as PartnerType,
      order: order ?? 0,
      isPublished: isPublished ?? true,
    },
  });

  return jsonSuccess(partner, 201);
}
