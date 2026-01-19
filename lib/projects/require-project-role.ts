// lib/projects/require-project-role.ts

import { prisma } from "@/lib/prisma";
import { hasRole } from "./project-role";
import type { ProjectRole } from "@/types/project-member";

interface ProjectAccessResult {
  hasAccess: boolean;
  userRole: ProjectRole | null;
}

export async function checkProjectAccess(
  projectId: string,
  userId: string
): Promise<ProjectAccessResult> {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) {
    return { hasAccess: false, userRole: null };
  }

  if (project.ownerId === userId) {
    return { hasAccess: true, userRole: "OWNER" };
  }

  const membership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId,
        projectId,
      },
    },
    select: { role: true },
  });

  if (!membership) {
    return { hasAccess: false, userRole: null };
  }

  return {
    hasAccess: true,
    userRole: membership.role as ProjectRole,
  };
}

export async function requireProjectRole(
  projectId: string,
  userId: string,
  requiredRole: ProjectRole
): Promise<ProjectRole> {
  const { hasAccess, userRole } = await checkProjectAccess(projectId, userId);

  if (!hasAccess || !userRole) {
    throw new Error("Access denied: You are not a member of this project");
  }

  if (!hasRole(userRole, requiredRole)) {
    throw new Error(
      `Access denied: ${requiredRole} role or higher is required`
    );
  }

  return userRole;
}

export async function requireProjectAccess(
  projectId: string,
  userId: string
): Promise<ProjectRole> {
  return requireProjectRole(projectId, userId, "VIEWER");
}