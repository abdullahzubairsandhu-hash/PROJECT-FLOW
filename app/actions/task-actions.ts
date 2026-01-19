// app/actions/task-actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";
import { createNotification } from "@/lib/notifications/notification-mutations";
import {
  requireTaskCreatePermission,
  requireTaskEditPermission,
  requireTaskDeletePermission,
} from "@/lib/tasks/task-authorization";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  TaskActionResult,
} from "@/types/task";

export async function createTask(
  projectId: string,
  data: CreateTaskInput
): Promise<TaskActionResult> {
  try {
    const user = await requireUser();

    await requireTaskCreatePermission(projectId, user.id);

    if (!data.title || data.title.trim().length === 0) {
      return {
        success: false,
        error: "Task title is required",
      };
    }

    if (data.title.length > 200) {
      return {
        success: false,
        error: "Task title must be less than 200 characters",
      };
    }

    if (data.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: data.assigneeId },
      });

      if (!assignee) {
        return {
          success: false,
          error: "Assignee user not found",
        };
      }

      const isProjectMember = await prisma.projectMember.findFirst({
        where: {
          projectId,
          userId: data.assigneeId,
        },
      });

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { ownerId: true },
      });

      if (!isProjectMember && project?.ownerId !== data.assigneeId) {
        return {
          success: false,
          error: "Assignee must be a member of the project",
        };
      }
    }

    const task = await prisma.task.create({
      data: {
        title: data.title.trim(),
        description: data.description?.trim() || null,
        status: data.status || "TODO",
        priority: data.priority || "MEDIUM",
        dueDate: data.dueDate || null,
        projectId,
        creatorId: user.id,
        assigneeId: data.assigneeId || null,
      },
    });
    // ADD THIS:
    if (data.assigneeId) {
      await createNotification({
        userId: data.assigneeId,
        type: "TASK_ASSIGNED",
        entityId: task.id,
        message: `Deployment: You have been assigned to task "${task.title}".`,
      });
    }

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      taskId: task.id,
    };
  } catch (error) {
    console.error("Failed to create task:", error);

    if (error instanceof Error && error.message.includes("Access denied")) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to create task. Please try again.",
    };
  }
}

export async function updateTask(
  taskId: string,
  data: UpdateTaskInput
): Promise<TaskActionResult> {
  try {
    const user = await requireUser();

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true, creatorId: true, title: true },
    });

    if (!existingTask) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    await requireTaskEditPermission(existingTask.projectId, user.id);

    if (data.title !== undefined) {
      if (data.title.trim().length === 0) {
        return {
          success: false,
          error: "Task title cannot be empty",
        };
      }

      if (data.title.length > 200) {
        return {
          success: false,
          error: "Task title must be less than 200 characters",
        };
      }
    }

    if (data.assigneeId !== undefined && data.assigneeId !== null) {
      const assignee = await prisma.user.findUnique({
        where: { id: data.assigneeId },
      });

      if (!assignee) {
        return {
          success: false,
          error: "Assignee user not found",
        };
      }

      const isProjectMember = await prisma.projectMember.findFirst({
        where: {
          projectId: existingTask.projectId,
          userId: data.assigneeId,
        },
      });

      const project = await prisma.project.findUnique({
        where: { id: existingTask.projectId },
        select: { ownerId: true },
      });

      if (!isProjectMember && project?.ownerId !== data.assigneeId) {
        return {
          success: false,
          error: "Assignee must be a member of the project",
        };
      }
    }

    const updateData: Record<string, unknown> = {};

    if (data.title !== undefined) updateData.title = data.title.trim();
    if (data.description !== undefined)
      updateData.description = data.description?.trim() || null;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.priority !== undefined) updateData.priority = data.priority;
    if (data.dueDate !== undefined) updateData.dueDate = data.dueDate;
    if (data.assigneeId !== undefined) updateData.assigneeId = data.assigneeId;

    await prisma.task.update({
      where: { id: taskId },
      data: updateData,
    });
    // ADD THIS logic to check if status became "DONE"
    if (data.status === "DONE") {
      // Notify the creator that their task was finished
      await createNotification({
        userId: existingTask.creatorId, // You'll need to add creatorId to your 'select' in existingTask fetch
        type: "STATUS_CHANGE",
        entityId: taskId,
        message: `Objective Complete: "${updateData.title || 'Task'}" has been marked as DONE.`,
      });
    }

    revalidatePath(`/projects/${existingTask.projectId}`);

    return {
      success: true,
      taskId,
    };
  } catch (error) {
    console.error("Failed to update task:", error);

    if (error instanceof Error && error.message.includes("Access denied")) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update task. Please try again.",
    };
  }
}

export async function deleteTask(taskId: string): Promise<TaskActionResult> {
  try {
    const user = await requireUser();

    const existingTask = await prisma.task.findUnique({
      where: { id: taskId },
      select: { projectId: true },
    });

    if (!existingTask) {
      return {
        success: false,
        error: "Task not found",
      };
    }

    await requireTaskDeletePermission(existingTask.projectId, user.id);

    await prisma.task.delete({
      where: { id: taskId },
    });

    revalidatePath(`/projects/${existingTask.projectId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete task:", error);

    if (error instanceof Error && error.message.includes("Access denied")) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to delete task. Please try again.",
    };
  }
}