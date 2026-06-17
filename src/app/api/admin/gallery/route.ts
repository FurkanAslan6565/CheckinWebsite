import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canManageGallery } from "@/lib/permissions";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageGallery(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const items = await prisma.galleryItem.findMany({
    orderBy: { createdAt: "desc" },
  });

  return jsonSuccess(items);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageGallery(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const body = await request.json();
  const { title, url, isVideo, category } = body;

  if (!url) {
    return jsonError("URL é obrigatório");
  }

  const item = await prisma.galleryItem.create({
    data: {
      title: title || null,
      url,
      isVideo: isVideo ?? false,
      category: category || "General",
    },
  });

  return jsonSuccess(item, 201);
}
