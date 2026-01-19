// lib/tasks/task-actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";
import {
  requireTaskCreatePermission,
  requireTaskEditPermission,
  requireTaskDeletePermission,
} from "./task-authorization";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  TaskWithDetails,
  TaskStatus,
  TaskPriority,
} from "@/types/task";

interface TaskActionResult {
  success: boolean;
  error?: string;
  task?: TaskWithDetails;
}

export async function createTask(
  projectId: string,
  input: CreateTaskInput
): Promise<TaskActionResult> {
  try {
    const user = await requireUser();

    await requireTaskCreatePermission(projectId, user.id);

    if (!input.title || input.title.trim().length === 0) {
      return {
        success: false,
        error: "Task title is required",
      };
    }

    if (input.title.length > 200) {
      return {
        success: false,
        error: "Task title must be less than 200 characters",
      };
    }

    if (input.assigneeId) {
      const assignee = await prisma.user.findUnique({
        where: { id: input.assigneeId },
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
          userId: input.assigneeId,
        },
      });

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        select: { ownerId: true },
      });

      if (!isProjectMember && project?.ownerId !== input.assigneeId) {
        return {
          success: false,
          error: "Assignee must be a member of the project",
        };
      }
    }

    const task = await prisma.task.create({
      data: {
        title: input.title.trim(),
        description: input.description?.trim() || null,
        status: input.status || "TODO",
        priority: input.priority || "MEDIUM",
        dueDate: input.dueDate || null,
        projectId,
        creatorId: user.id,
        assigneeId: input.assigneeId || null,
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
    });

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate,
        projectId: task.projectId,
        creatorId: task.creatorId,
        assigneeId: task.assigneeId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        creator: task.creator,
        assignee: task.assignee,
      },
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
  input: UpdateTaskInput
): Promise<TaskActionResult> {
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

    await requireTaskEditPermission(existingTask.projectId, user.id);

    if (input.title !== undefined) {
      if (input.title.trim().length === 0) {
        return {
          success: false,
          error: "Task title cannot be empty",
        };
      }

      if (input.title.length > 200) {
        return {
          success: false,
          error: "Task title must be less than 200 characters",
        };
      }
    }

    if (input.assigneeId !== undefined && input.assigneeId !== null) {
      const assignee = await prisma.user.findUnique({
        where: { id: input.assigneeId },
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
          userId: input.assigneeId,
        },
      });

      const project = await prisma.project.findUnique({
        where: { id: existingTask.projectId },
        select: { ownerId: true },
      });

      if (!isProjectMember && project?.ownerId !== input.assigneeId) {
        return {
          success: false,
          error: "Assignee must be a member of the project",
        };
      }
    }

    const updateData: Record<string, unknown> = {};

    if (input.title !== undefined) updateData.title = input.title.trim();
    if (input.description !== undefined)
      updateData.description = input.description?.trim() || null;
    if (input.status !== undefined) updateData.status = input.status;
    if (input.priority !== undefined) updateData.priority = input.priority;
    if (input.dueDate !== undefined) updateData.dueDate = input.dueDate;
    if (input.assigneeId !== undefined) updateData.assigneeId = input.assigneeId;

    const task = await prisma.task.update({
      where: { id: taskId },
      data: updateData,
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

    revalidatePath(`/projects/${existingTask.projectId}`);

    return {
      success: true,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate,
        projectId: task.projectId,
        creatorId: task.creatorId,
        assigneeId: task.assigneeId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        creator: task.creator,
        assignee: task.assignee,
      },
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

export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus
): Promise<TaskActionResult> {
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

    await requireTaskEditPermission(existingTask.projectId, user.id);

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { status },
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

    revalidatePath(`/projects/${existingTask.projectId}`);

    return {
      success: true,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate,
        projectId: task.projectId,
        creatorId: task.creatorId,
        assigneeId: task.assigneeId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        creator: task.creator,
        assignee: task.assignee,
      },
    };
  } catch (error) {
    console.error("Failed to update task status:", error);

    if (error instanceof Error && error.message.includes("Access denied")) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update task status. Please try again.",
    };
  }
}

export async function updateTaskPriority(
  taskId: string,
  priority: TaskPriority
): Promise<TaskActionResult> {
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

    await requireTaskEditPermission(existingTask.projectId, user.id);

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { priority },
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

    revalidatePath(`/projects/${existingTask.projectId}`);

    return {
      success: true,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate,
        projectId: task.projectId,
        creatorId: task.creatorId,
        assigneeId: task.assigneeId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        creator: task.creator,
        assignee: task.assignee,
      },
    };
  } catch (error) {
    console.error("Failed to update task priority:", error);

    if (error instanceof Error && error.message.includes("Access denied")) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update task priority. Please try again.",
    };
  }
}

export async function assignTask(
  taskId: string,
  assigneeId: string | null
): Promise<TaskActionResult> {
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

    await requireTaskEditPermission(existingTask.projectId, user.id);

    if (assigneeId !== null) {
      const assignee = await prisma.user.findUnique({
        where: { id: assigneeId },
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
          userId: assigneeId,
        },
      });

      const project = await prisma.project.findUnique({
        where: { id: existingTask.projectId },
        select: { ownerId: true },
      });

      if (!isProjectMember && project?.ownerId !== assigneeId) {
        return {
          success: false,
          error: "Assignee must be a member of the project",
        };
      }
    }

    const task = await prisma.task.update({
      where: { id: taskId },
      data: { assigneeId },
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

    revalidatePath(`/projects/${existingTask.projectId}`);

    return {
      success: true,
      task: {
        id: task.id,
        title: task.title,
        description: task.description,
        status: task.status as TaskStatus,
        priority: task.priority as TaskPriority,
        dueDate: task.dueDate,
        projectId: task.projectId,
        creatorId: task.creatorId,
        assigneeId: task.assigneeId,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        creator: task.creator,
        assignee: task.assignee,
      },
    };
  } catch (error) {
    console.error("Failed to assign task:", error);

    if (error instanceof Error && error.message.includes("Access denied")) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to assign task. Please try again.",
    };
  }
}

