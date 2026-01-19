// lib/tasks/task-comment-queries.ts
import { prisma } from "@/lib/prisma";
import { TaskCommentWithAuthor } from "@/types/task-comment";
import { requireTaskViewPermission } from "./task-authorization";


export async function getTaskComments(
  taskId: string, 
  userId: string
): Promise<TaskCommentWithAuthor[]> {
  // 1. Fetch task to verify existence and get projectId
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { projectId: true }
  });

  if (!task) throw new Error("Task not found.");

  // 2. Enforce Permission
  await requireTaskViewPermission(task.projectId, userId);

  // 3. Single Batch Query: Fetch comments, authors, AND reactions at once
  // This replaces the slow Promise.all loop
  const comments = await prisma.taskComment.findMany({
    where: { taskId },
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
      reactions: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  // 4. Transform data if necessary to match TaskCommentWithAuthor type
  // Prisma gives us the data in a flat structure now, no more mapping needed!
  return comments as unknown as TaskCommentWithAuthor[];
}