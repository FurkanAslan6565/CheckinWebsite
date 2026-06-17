import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canManageGallery } from "@/lib/permissions";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageGallery(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  });

  return jsonSuccess(assets);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageGallery(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const body = await request.json();
  const { filename, url, cloudinaryId, bytes, mimeType } = body;

  if (!filename || !url || !cloudinaryId) {
    return jsonError("Campos obrigatórios em falta");
  }

  const asset = await prisma.mediaAsset.create({
    data: {
      filename,
      url,
      cloudinaryId,
      bytes: bytes || 0,
      mimeType: mimeType || "image/jpeg",
    },
  });

  return jsonSuccess(asset, 201);
}

export async function DELETE(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageGallery(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return jsonError("ID em falta");
  }

  await prisma.mediaAsset.delete({ where: { id } });
  return jsonSuccess({ success: true });
}
