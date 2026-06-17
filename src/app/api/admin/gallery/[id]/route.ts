import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canManageGallery } from "@/lib/permissions";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageGallery(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const body = await request.json();

  const item = await prisma.galleryItem.update({
    where: { id },
    data: {
      title: body.title,
      url: body.url,
      isVideo: body.isVideo,
      category: body.category,
    },
  });

  return jsonSuccess(item);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageGallery(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  await prisma.galleryItem.delete({ where: { id } });
  return jsonSuccess({ success: true });
}
