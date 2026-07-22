import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import type { Role } from "@prisma/client";
import { hasMinRole } from "@/lib/permissions";

type AuthResult =
  | { session: Session; error: null }
  | { session: null; error: NextResponse };

export async function requireAuth(minRole?: Role): Promise<AuthResult> {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      session: null,
      error: NextResponse.json({ error: "Não autorizado" }, { status: 401 }),
    };
  }

  if (minRole && !hasMinRole(session.user.role, minRole)) {
    return {
      session: null,
      error: NextResponse.json({ error: "Permissão insuficiente" }, { status: 403 }),
    };
  }

  return { session, error: null };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function jsonSuccess<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}
