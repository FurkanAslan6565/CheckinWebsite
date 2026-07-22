import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  // Only SUPER_ADMIN and ADMIN can delete contact messages
  const userRole = session!.user.role;
  if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;

  try {
    const existing = await prisma.contactMessage.findUnique({ where: { id } });
    if (!existing) {
      return jsonError("Mensagem não encontrada", 404);
    }

    await prisma.contactMessage.delete({ where: { id } });
    return jsonSuccess({ success: true });
  } catch (err) {
    console.error("Error deleting contact message:", err);
    return jsonError("Erro ao eliminar a mensagem", 500);
  }
}
