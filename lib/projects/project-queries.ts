// lib/projects/project-queries.ts

import { prisma } from "@/lib/prisma";
import { checkProjectAccess } from "./require-project-role";
import { mapPrismaProjectsToProjects, mapPrismaProjectToProject } from "./project-mapper";
import type { Project } from "@/types/project";
import type { ProjectWithRole } from "@/types/project-member";

export async function getUserProjects(userId: string): Promise<Project[]> {
  // We fetch in one go using an OR condition: 
  // Either you OWN the project OR you are a MEMBER of it.
  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: userId },
        {
          members: {
            some: {
              userId: userId,
            },
          },
        },
      ],
    },
    include: {
      _count: {
        select: { tasks: true },
      },
      members: {
        where: { userId: userId },
        select: { role: true }
      }
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // This ensures your return type 'Project[]' remains identical to what it was
  return mapPrismaProjectsToProjects(projects, userId);
}

export async function getProjectById(
  projectId: string,
  userId: string
): Promise<ProjectWithRole | null> {
  const { hasAccess, userRole } = await checkProjectAccess(projectId, userId);

  if (!hasAccess || !userRole) {
    return null;
  }

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });

  if (!project) {
    return null;
  }

  const mappedProject = mapPrismaProjectToProject(project, userId);

  return {
    ...mappedProject,
    currentUserRole: userRole,
  }as ProjectWithRole;
}

export async function verifyProjectOwnership(
  projectId: string,
  userId: string
): Promise<boolean> {
  const project = await prisma.project.findFirst({
    where: {
      id: projectId,
      ownerId: userId,
    },
    select: {
      id: true,
    },
  });

  return project !== null;
}