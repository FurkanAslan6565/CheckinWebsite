import { prisma } from "@/lib/prisma";
import { requireAuth, jsonSuccess, jsonError } from "@/lib/api-auth";
import { canManageUsers } from "@/lib/permissions";
import bcrypt from "bcryptjs";
import type { Role } from "@prisma/client";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageUsers(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: {
          projects: true,
          opportunities: true,
          newsArticles: true,
        },
      },
    },
  });

  return jsonSuccess(users);
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  if (!canManageUsers(session!.user.role)) {
    return jsonError("Permissão insuficiente", 403);
  }

  const body = await request.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password || !role) {
    return jsonError("Campos obrigatórios em falta");
  }

  if (role === "SUPER_ADMIN" && session!.user.role !== "SUPER_ADMIN") {
    return jsonError("Apenas Super Admin pode criar outros Super Admins", 403);
  }

  const existing = await prisma.user.findUnique({
    where: { email: email.toLowerCase() },
  });
  if (existing) {
    return jsonError("Email já registado");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: role as Role,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
    },
  });

  return jsonSuccess(user, 201);
}
