// lib/projects/project-members.ts

import { prisma } from "@/lib/prisma";
import { requireProjectRole } from "./require-project-role";
import { canManageMembers, canPromoteToAdmin, canDemoteFromAdmin } from "./project-role";
import type { ProjectMember, ProjectRole } from "@/types/project-member";
import { auth } from "@clerk/nextjs/server";

function mapUser(user: {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  imageUrl: string | null;
}) {
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

  return {
    id: user.id,
    email: user.email,
    name,
    imageUrl: user.imageUrl,
  };
}



export async function getProjectMembers(
  projectId: string,
  requestingUserId: string
): Promise<ProjectMember[]> {
  await requireProjectRole(projectId, requestingUserId, "VIEWER");

  const members = await prisma.projectMember.findMany({
    where: { projectId },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          imageUrl: true,
        },
      },
      
    },
    orderBy: { createdAt: "asc" },
  });

  return members.map((member) => ({
    id: member.id,
    userId: member.userId,
    projectId: member.projectId,
    role: member.role as ProjectRole,
    createdAt: member.createdAt,
    user: mapUser(member.user),
  }));
}

export async function addProjectMember(
  projectId: string,
  targetUserId: string,
  role: ProjectRole,
  requestingUserId: string
): Promise<ProjectMember> {
  const requestingUserRole = await requireProjectRole(
    projectId,
    requestingUserId,
    "ADMIN"
  );

  if (!canManageMembers(requestingUserRole)) {
    throw new Error("Access denied: You cannot add members to this project");
  }

  if (role === "ADMIN" && !canPromoteToAdmin(requestingUserRole)) {
    throw new Error("Access denied: Only owners can add admins");
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { ownerId: true },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.ownerId === targetUserId) {
    throw new Error("Project owner is already a member");
  }

  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
  });

  if (!targetUser) {
    throw new Error("User not found");
  }

  const existingMembership = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: targetUserId,
        projectId,
      },
    },
  });

  if (existingMembership) {
    throw new Error("User is already a member of this project");
  }

  const member = await prisma.projectMember.create({
    data: {
      userId: targetUserId,
      projectId,
      role,
    },
    include: {
      user: {
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

  return {
    id: member.id,
    userId: member.userId,
    projectId: member.projectId,
    role: member.role as ProjectRole,
    createdAt: member.createdAt,
    user: mapUser(member.user),
  };
}

export async function updateProjectMemberRole(
  projectId: string,
  targetUserId: string,
  newRole: ProjectRole,
  requestingUserId: string
): Promise<ProjectMember> {
  const requestingUserRole = await requireProjectRole(
    projectId,
    requestingUserId,
    "ADMIN"
  );

  if (!canManageMembers(requestingUserRole)) {
    throw new Error("Access denied: You cannot update member roles");
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: targetUserId,
        projectId,
      },
    },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  const currentRole = member.role as ProjectRole;

  if (newRole === "ADMIN" && !canPromoteToAdmin(requestingUserRole)) {
    throw new Error("Access denied: Only owners can promote to admin");
  }

  if (currentRole === "ADMIN" && !canDemoteFromAdmin(requestingUserRole)) {
    throw new Error("Access denied: Only owners can demote admins");
  }

  if (targetUserId === requestingUserId) {
    throw new Error("You cannot change your own role");
  }

  const updatedMember = await prisma.projectMember.update({
    where: {
      userId_projectId: {
        userId: targetUserId,
        projectId,
      },
    },
    data: { role: newRole },
    include: {
      user: {
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

  return {
    id: updatedMember.id,
    userId: updatedMember.userId,
    projectId: updatedMember.projectId,
    role: updatedMember.role as ProjectRole,
    createdAt: updatedMember.createdAt,
    user: mapUser(updatedMember.user),
  };
}

export async function removeProjectMember(
  projectId: string,
  targetUserId: string,
  requestingUserId: string
): Promise<void> {
  const requestingUserRole = await requireProjectRole(
    projectId,
    requestingUserId,
    "ADMIN"
  );

  if (!canManageMembers(requestingUserRole)) {
    throw new Error("Access denied: You cannot remove members");
  }

  const member = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: targetUserId,
        projectId,
      },
    },
  });

  if (!member) {
    throw new Error("Member not found");
  }

  const memberRole = member.role as ProjectRole;

  if (memberRole === "ADMIN" && !canDemoteFromAdmin(requestingUserRole)) {
    throw new Error("Access denied: Only owners can remove admins");
  }

  if (targetUserId === requestingUserId) {
    throw new Error("You cannot remove yourself from the project");
  }

  await prisma.projectMember.delete({
    where: {
      userId_projectId: {
        userId: targetUserId,
        projectId,
      },
    },
  });
}

export async function addProjectMemberByEmail(
  projectId: string,
  email: string,
  role: ProjectRole
): Promise<ProjectMember> {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const requestingUserRole = await requireProjectRole(
    projectId,
    userId,
    "ADMIN"
  );

  if (!canManageMembers(requestingUserRole)) {
    throw new Error("You do not have permission to invite members");
  }

  if (role === "ADMIN" && !canPromoteToAdmin(requestingUserRole)) {
    throw new Error("Only owners can invite admins");
  }

  const targetUser = await prisma.user.findFirst({
    where: {
      email: email.toLowerCase().trim(),
    },
  });
  

  if (!targetUser) {
    throw new Error("No user found with this email");
  }

  const existingMember = await prisma.projectMember.findUnique({
    where: {
      userId_projectId: {
        userId: targetUser.id,
        projectId,
      },
    },
  });

  if (existingMember) {
    throw new Error("User is already a member of this project");
  }

  const member = await prisma.projectMember.create({
    data: {
      userId: targetUser.id,
      projectId,
      role,
    },
    include: {
      user: {
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

  const name =
    [member.user.firstName, member.user.lastName].filter(Boolean).join(" ") ||
    null;

  return {
    id: member.id,
    userId: member.userId,
    projectId: member.projectId,
    role: member.role as ProjectRole,
    createdAt: member.createdAt,
    user: {
      id: member.user.id,
      email: member.user.email,
      name,
      imageUrl: member.user.imageUrl,
    },
  };
}
