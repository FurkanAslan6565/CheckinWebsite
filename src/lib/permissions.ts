import type { Role } from "@prisma/client";

export const ROLE_LABELS: Record<Role, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Administrador",
  EDITOR: "Editor",
  PROJECT_MANAGER: "Gestor de Projetos",
};

export const ROLE_HIERARCHY: Record<Role, number> = {
  SUPER_ADMIN: 4,
  ADMIN: 3,
  PROJECT_MANAGER: 2,
  EDITOR: 1,
};

export function hasMinRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function canManageUsers(role: Role): boolean {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

export function canDeleteUsers(role: Role): boolean {
  return role === "SUPER_ADMIN";
}

export function canManageProjects(role: Role): boolean {
  return ["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"].includes(role);
}

export function canManageOpportunities(role: Role): boolean {
  return ["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"].includes(role);
}

export function canManageNews(role: Role): boolean {
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role);
}

export function canManagePartners(role: Role): boolean {
  return ["SUPER_ADMIN", "ADMIN"].includes(role);
}

export function canManageGallery(role: Role): boolean {
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(role);
}

export function canViewApplications(role: Role): boolean {
  return ["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"].includes(role);
}

export function canManageApplications(role: Role): boolean {
  return ["SUPER_ADMIN", "ADMIN", "PROJECT_MANAGER"].includes(role);
}
