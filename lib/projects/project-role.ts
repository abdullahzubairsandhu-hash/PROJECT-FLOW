// lib/projects/project-role.ts

import type { ProjectRole } from "@/types/project-member";

const roleHierarchy: Record<ProjectRole, number> = {
  OWNER: 4,
  ADMIN: 3,
  MEMBER: 2,
  VIEWER: 1,
};

export function hasRole(userRole: ProjectRole, requiredRole: ProjectRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

export function canManageMembers(role: ProjectRole): boolean {
  return hasRole(role, "ADMIN");
}

export function canEditProject(role: ProjectRole): boolean {
  return hasRole(role, "ADMIN");
}

export function canDeleteProject(role: ProjectRole): boolean {
  return role === "OWNER";
}

export function canCreateTasks(role: ProjectRole): boolean {
  return hasRole(role, "MEMBER");
}

export function canEditTasks(role: ProjectRole): boolean {
  return hasRole(role, "MEMBER");
}

export function canViewProject(role: ProjectRole): boolean {
  return hasRole(role, "VIEWER");
}

export function canPromoteToAdmin(actorRole: ProjectRole): boolean {
  return actorRole === "OWNER";
}

export function canDemoteFromAdmin(actorRole: ProjectRole): boolean {
  return actorRole === "OWNER";
}