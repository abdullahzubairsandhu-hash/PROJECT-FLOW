// lib/tasks/task-authorization.ts

import { requireProjectRole } from "@/lib/projects/require-project-role";
import { canCreateTasks, canEditTasks } from "@/lib/projects/project-role";
import type { ProjectRole } from "@/types/project-member";

export async function requireTaskCreatePermission(
  projectId: string,
  userId: string
): Promise<ProjectRole> {
  const userRole = await requireProjectRole(projectId, userId, "ADMIN");

  if (!canCreateTasks(userRole)) {
    throw new Error("Access denied: You don't have permission to create tasks");
  }

  return userRole;
}

export async function requireTaskEditPermission(
  projectId: string,
  userId: string
): Promise<ProjectRole> {
  const userRole = await requireProjectRole(projectId, userId, "ADMIN");

  if (!canEditTasks(userRole)) {
    throw new Error("Access denied: You don't have permission to edit tasks");
  }

  return userRole;
}

export async function requireTaskDeletePermission(
  projectId: string,
  userId: string
): Promise<ProjectRole> {
  const userRole = await requireProjectRole(projectId, userId, "ADMIN");

  if (!canEditTasks(userRole)) {
    throw new Error("Access denied: You don't have permission to delete tasks");
  }

  return userRole;
}

export async function requireTaskViewPermission(
  projectId: string,
  userId: string
): Promise<ProjectRole> {
  return await requireProjectRole(projectId, userId, "VIEWER");
}
