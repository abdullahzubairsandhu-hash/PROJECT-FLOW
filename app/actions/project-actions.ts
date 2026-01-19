// app/actions/project-actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";
import { requireProjectRole } from "@/lib/projects/require-project-role";
import { canEditProject, canDeleteProject } from "@/lib/projects/project-role";
import type { CreateProjectInput, ProjectActionResult, ProjectStatus } from "@/types/project";
import { createNotification } from "@/lib/notifications/notification-mutations";

export async function createProject(
  data: CreateProjectInput
): Promise<ProjectActionResult> {
  try {
    const user = await requireUser();

    if (!data.name || data.name.trim().length === 0) {
      return {
        success: false,
        error: "Project name is required",
      };
    }

    if (data.name.length > 100) {
      return {
        success: false,
        error: "Project name must be less than 100 characters",
      };
    }

    const project = await prisma.project.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
        status: data.status,
        ownerId: user.id,
        members: {
          create: {
            userId: user.id,
            role: "OWNER",
          },
        },
      },
    });
    // ADD THIS:
    await createNotification({
      userId: user.id, // Logging it for the owner's history
      type: "PROJECT_CREATED",
      entityId: project.id,
      message: `System: Project "${project.name}" initialized successfully.`,
    });

    revalidatePath("/projects");

    return {
      success: true,
      projectId: project.id,
    };
  } catch (error) {
    console.error("Failed to create project:", error);
    return {
      success: false,
      error: "Failed to create project. Please try again.",
    };
  }
}

export async function deleteProject(
  projectId: string
): Promise<ProjectActionResult> {
  try {
    const user = await requireUser();

    const userRole = await requireProjectRole(projectId, user.id, "OWNER");

    if (!canDeleteProject(userRole)) {
      return {
        success: false,
        error: "Access denied: Only project owners can delete projects",
      };
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    revalidatePath("/projects");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to delete project:", error);

    if (error instanceof Error && error.message.includes("Access denied")) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to delete project. Please try again.",
    };
  }
}

export async function updateProjectStatus(
  projectId: string,
  status: ProjectStatus
): Promise<ProjectActionResult> {
  try {
    const user = await requireUser();

    const userRole = await requireProjectRole(projectId, user.id, "ADMIN");

    if (!canEditProject(userRole)) {
      return {
        success: false,
        error: "Access denied: You don't have permission to update this project",
      };
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status },
    });
    // ADD THIS:
    await createNotification({
      userId: user.id, 
      type: "STATUS_CHANGE",
      entityId: projectId,
      message: `Alert: Project status updated to ${status}.`,
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update project status:", error);

    if (error instanceof Error && error.message.includes("Access denied")) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to update project. Please try again.",
    };
  }
}


// ... keep your existing imports (prisma, etc.)  (members function for global task list's initiallize new task button)

export async function getProjectMembersAction(projectId: string) {
  try {
    const members = await prisma.projectMember.findMany({
      where: { projectId },
      include: {
        user: true, // Make sure the whole user object is fetched
      },
    });

    // Strip complex Prisma objects into plain JSON for the client
    const plainMembers = JSON.parse(JSON.stringify(members));

    return { success: true, members: plainMembers };
  } catch (error) {
    console.error("Error:", error);
    return { success: false, error: "Failed" };
  }
}