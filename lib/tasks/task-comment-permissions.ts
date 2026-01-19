// lib/tasks/task-comment-permissions.ts
import { prisma } from "@/lib/prisma";
// import { ProjectRole } from "@prisma/client";
import { requireProjectRole } from "@/lib/projects/require-project-role";
import { TaskComment, ProjectRole } from "@prisma/client";

/**
 * Ensures the user has permission to comment.
 * Reuses requireProjectRole to maintain consistency.
 */
export async function requireTaskCommentPermission(taskId: string, userId: string) {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true }
  });

  if (!task) {
    throw new Error("Task not found.");
  }

  // Use your existing role checker. 
  // We require MEMBER role (which includes ADMIN/OWNER) to comment.
  return await requireProjectRole(task.projectId, userId, "MEMBER");
}

/**
 * Rules:
 * - Author can edit their own comment
 * - Only Author can edit (even ADMIN/OWNER shouldn't edit others' words)
 */
export function canEditTaskComment(comment: TaskComment, userId: string): boolean {
    return comment.authorId === userId;
  }
  
  /**
   * Rules:
   * - Author can delete their own comment
   * - OWNER / ADMIN can delete any comment
   * - MEMBER can delete only their own
   */
  export function canDeleteTaskComment(
    comment: TaskComment,
    userId: string,
    userRole: ProjectRole
  ): boolean {
    const isAuthor = comment.authorId === userId;
    const isPrivileged = userRole === ProjectRole.OWNER || userRole === ProjectRole.ADMIN;
  
    return isAuthor || isPrivileged;
  }