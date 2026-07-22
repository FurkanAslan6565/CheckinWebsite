import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canManageUsers, canDeleteUsers } from "@/lib/permissions";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageUsers(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const { id } = await context.params;
  const body = await request.json();

  if (body.role === "SUPER_ADMIN" && session!.user.role !== "SUPER_ADMIN") {
    return jsonError("Apenas Super Admin pode atribuir role Super Admin", 403);
  }

  const updateData: {
    name?: string;
    email?: string;
    role?: Role;
    passwordHash?: string;
  } = {};

  if (body.name) updateData.name = body.name;
  if (body.email) updateData.email = body.email.toLowerCase();
  if (body.role) updateData.role = body.role as Role;
  if (body.password) {
    updateData.passwordHash = await bcrypt.hash(body.password, 12);
  }

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      updatedAt: true,
    },
  });

  return jsonSuccess(user);
}

export async function DELETE(_request: Request, context: RouteContext) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canDeleteUsers(session!.user.role)) {
    return jsonError("Apenas Super Admin pode eliminar utilizadores", 403);
  }

  const { id } = await context.params;

  if (id === session!.user.id) {
    return jsonError("Não pode eliminar a sua própria conta");
  }

  await prisma.user.delete({ where: { id } });
  return jsonSuccess({ success: true });
}
