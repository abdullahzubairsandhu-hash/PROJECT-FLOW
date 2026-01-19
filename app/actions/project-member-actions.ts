// app/actions/project-member-actions.ts

"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/require-user";
import { addProjectMember } from "@/lib/projects/project-members";
import { prisma } from "@/lib/prisma";
import type { ProjectRole } from "@/types/project-member";

interface MemberActionResult {
  success: boolean;
  error?: string;
}

export async function addProjectMemberByEmail(
  projectId: string,
  email: string,
  role: ProjectRole
): Promise<MemberActionResult> {
  try {
    const requestingUser = await requireUser();

    const targetUser = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    if (!targetUser) {
      return {
        success: false,
        error: "User with this email not found. They must sign up first.",
      };
    }

    await addProjectMember(projectId, targetUser.id, role, requestingUser.id);

    revalidatePath(`/projects/${projectId}`);

    return {
      success: true,
    };
  } catch (error) {
    console.error("Failed to add project member:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Failed to add member. Please try again.",
    };
  }
}