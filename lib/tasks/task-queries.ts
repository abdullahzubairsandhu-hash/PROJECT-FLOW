// lib/tasks/task-queries.ts

import { prisma } from "@/lib/prisma";
import { requireTaskViewPermission } from "./task-authorization";
import type { TaskWithDetails } from "@/types/task";

export async function getProjectTasks(
  projectId: string | undefined,
  userId: string
): Promise<TaskWithDetails[]> {
  // If this is a project-specific request, enforce permission
  if (projectId) {
    await requireTaskViewPermission(projectId, userId);
  }

  const tasks = await prisma.task.findMany({
    where: {
      ...(projectId ? { projectId } : {}),
      OR: [
        { creatorId: userId },
        { assigneeId: userId },
      ],
    },
    include: {
      creator: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      assignee: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }],
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as "TODO" | "IN_PROGRESS" | "DONE",
    priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
    dueDate: task.dueDate,
    projectId: task.projectId,
    creatorId: task.creatorId,
    assigneeId: task.assigneeId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    creator: task.creator,
    assignee: task.assignee,
  }));
}

export async function getTaskById(
  taskId: string,
  userId: string
): Promise<TaskWithDetails | null> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      creator: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      assignee: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
    },
  });

  if (!task) {
    return null;
  }

  await requireTaskViewPermission(task.projectId, userId);

  return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status as "TODO" | "IN_PROGRESS" | "DONE",
    priority: task.priority as "LOW" | "MEDIUM" | "HIGH",
    dueDate: task.dueDate,
    projectId: task.projectId,
    creatorId: task.creatorId,
    assigneeId: task.assigneeId,
    createdAt: task.createdAt,
    updatedAt: task.updatedAt,
    creator: task.creator,
    assignee: task.assignee,
  };
}

export async function verifyTaskExists(taskId: string): Promise<boolean> {
  const task = await prisma.task.findUnique({
    where: { id: taskId },
    select: { id: true },
  });

  return task !== null;
}

export async function getUserTasks(userId: string) {
  return await prisma.task.findMany({
    where: {
      OR: [
        { creatorId: userId },
        { assigneeId: userId },
        {
          project: {
            OR: [
              { ownerId: userId }, // Catch tasks from projects you OWN
              { members: { some: { userId } } } // Catch tasks from projects you are a MEMBER of
            ]
          }
        }
      ],
    },
    include: {
      creator: true,
      assignee: true,
      project: true, 
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
