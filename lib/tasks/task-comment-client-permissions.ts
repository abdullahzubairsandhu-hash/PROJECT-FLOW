// lib/tasks/task-comment-client-permissions.ts

import { ProjectRole, TaskComment } from "@prisma/client";

/**
 * Client-safe permission checks
 * (NO prisma, NO server imports)
 */

export function canEditTaskComment(
  comment: Pick<TaskComment, "authorId">,
  userId: string
): boolean {
  return comment.authorId === userId;
}

export function canDeleteTaskComment(
  comment: Pick<TaskComment, "authorId">,
  userId: string,
  userRole: ProjectRole
): boolean {
  const isAuthor = comment.authorId === userId;
  const isPrivileged =
    userRole === ProjectRole.OWNER || userRole === ProjectRole.ADMIN;

  return isAuthor || isPrivileged;
}
