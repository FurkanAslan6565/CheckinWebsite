import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { slugify } from "@/lib/slug";
import { canManageNews } from "@/lib/permissions";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageNews(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const news = await prisma.news.findMany({
    orderBy: { updatedAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return jsonSuccess(news);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageNews(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const body = await request.json();
  const { title, content, coverImageUrl, isPublished } = body;

  if (!title || !content || !coverImageUrl) {
    return jsonError("Campos obrigatórios em falta");
  }

  let slug = slugify(title);
  const existing = await prisma.news.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now()}`;
  }

  const article = await prisma.news.create({
    data: {
      title,
      slug,
      content,
      coverImageUrl,
      isPublished: isPublished ?? false,
      authorId: session!.user.id,
    },
  });

  return jsonSuccess(article, 201);
}
