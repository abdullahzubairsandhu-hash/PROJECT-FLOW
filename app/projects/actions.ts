// app/projects/actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";
import { addProjectMemberByEmail } from "@/lib/projects/project-members";
import type { ProjectRole } from "@/types/project-member";

interface CreateProjectInput {
  name: string;
  description?: string;
  status: "PLANNING" | "ACTIVE" | "COMPLETED";
}

interface ProjectActionResult {
  success: boolean;
  error?: string;
  projectId?: string;
}

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
      },
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

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: user.id,
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found or you don't have permission to delete it",
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
    return {
      success: false,
      error: "Failed to delete project. Please try again.",
    };
  }
}

export async function updateProjectStatus(
  projectId: string,
  status: "PLANNING" | "ACTIVE" | "COMPLETED"
): Promise<ProjectActionResult> {
  try {
    const user = await requireUser();

    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        ownerId: user.id,
      },
    });

    if (!project) {
      return {
        success: false,
        error: "Project not found or you don't have permission to update it",
      };
    }

    await prisma.project.update({
      where: { id: projectId },
      data: { status },
    });

    revalidatePath("/projects");
    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to update project status:", error);
    return {
      success: false,
      error: "Failed to update project. Please try again.",
    };
  }
}

export async function inviteProjectMemberAction(
  projectId: string,
  email: string,
  role: ProjectRole
) {

  try {
    const member = await addProjectMemberByEmail(
      projectId,
      email,
      role,
    );

    return { success: true, member };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to invite member",
    };
  }
}