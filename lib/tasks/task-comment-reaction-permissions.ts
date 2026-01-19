import { prisma } from "@/lib/prisma";
import { requireTaskViewPermission } from "@/lib/tasks/task-authorization";

export async function canReactToComment(commentId: string, userId: string) {
  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId },
    select: { taskId: true, task: { select: { projectId: true } } }
  });

  if (!comment) throw new Error("Comment not found");

  // Reusing existing logic: If you can view the task, you can react
  await requireTaskViewPermission(comment.task.projectId, userId);
  return comment;
}