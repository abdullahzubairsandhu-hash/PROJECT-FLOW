// lib/tasks/task-comment-mutations.ts

import { prisma } from "@/lib/prisma";
import { requireTaskCommentPermission } from "./task-comment-permissions";
import { TaskCommentWithAuthor } from "@/types/task-comment";
import { canEditTaskComment, canDeleteTaskComment } from "./task-comment-client-permissions";
import { ProjectRole } from "@prisma/client";
import { createNotification } from "@/lib/notifications/notification-mutations"; // Import this

export async function createTaskComment(
  taskId: string,
  userId: string,
  content: string
): Promise<TaskCommentWithAuthor> {
  if (!content.trim()) {
    throw new Error("Comment content cannot be empty.");
  }

  // Will throw if role < MEMBER
  await requireTaskCommentPermission(taskId, userId);

  // 1. Create the comment
  const comment = await prisma.taskComment.create({
    data: {
      content: content.trim(),
      taskId,
      authorId: userId,
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      task: { // 👈 Include task to get creator and assignee for notifications
        select: {
          title: true,
          creatorId: true,
          assigneeId: true,
        },
      },
    },
  });

  // 2. Determine who to notify (Stakeholders minus the author)
  const { task } = comment;
  const recipients = new Set<string>();

  if (task.creatorId && task.creatorId !== userId) {
    recipients.add(task.creatorId);
  }
  if (task.assigneeId && task.assigneeId !== userId) {
    recipients.add(task.assigneeId);
  }

  // 3. Trigger Notifications (Fire and forget, don't wait for these to return)
  if (recipients.size > 0) {
    Promise.allSettled(
      Array.from(recipients).map((recipientId) =>
        createNotification({
          userId: recipientId,
          type: "TASK_COMMENT",
          entityId: taskId,
          message: `New comment on task: ${task.title}`,
        })
      )
    ).catch((err) => console.error("Notification failed to send:", err));
  }

  return comment as TaskCommentWithAuthor;
}

export async function updateTaskComment(
  commentId: string,
  userId: string,
  content: string
) {
  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId },
  });

  if (!comment || !canEditTaskComment(comment, userId)) {
    throw new Error("Unauthorized: Cannot edit this comment");
  }

  if (!content.trim()) {
    throw new Error("Content cannot be empty");
  }

  return await prisma.taskComment.update({
    where: { id: commentId },
    data: { content: content.trim() },
  });
}

export async function deleteTaskComment(
  commentId: string,
  userId: string,
  userRole: ProjectRole
) {
  const comment = await prisma.taskComment.findUnique({
    where: { id: commentId },
  });

  if (!comment || !canDeleteTaskComment(comment, userId, userRole)) {
    throw new Error("Unauthorized: Cannot delete this comment");
  }

  return await prisma.taskComment.delete({
    where: { id: commentId },
  });
}