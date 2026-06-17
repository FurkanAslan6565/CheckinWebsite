import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { slugify } from "@/lib/slug";
import { canManageNews } from "@/lib/permissions";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageNews(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const article = await prisma.news.findUnique({ where: { id } });

  if (!article) {
    return jsonError("Notícia não encontrada", 404);
  }

  return jsonSuccess(article);
}

export async function PUT(request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageNews(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const body = await request.json();

  const existing = await prisma.news.findUnique({ where: { id } });
  if (!existing) {
    return jsonError("Notícia não encontrada", 404);
  }

  let slug = existing.slug;
  if (body.title && body.title !== existing.title) {
    slug = slugify(body.title);
    const slugConflict = await prisma.news.findFirst({
      where: { slug, NOT: { id } },
    });
    if (slugConflict) {
      slug = `${slug}-${Date.now()}`;
    }
  }

  const article = await prisma.news.update({
    where: { id },
    data: {
      title: body.title,
      slug,
      content: body.content,
      coverImageUrl: body.coverImageUrl,
      isPublished: body.isPublished,
    },
  });

  return jsonSuccess(article);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageNews(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  await prisma.news.delete({ where: { id } });
  return jsonSuccess({ success: true });
}
