import type { Project as PrismaProject } from "@prisma/client";
import type { Project, ProjectStatus } from "@/types/project";

/**
 * Maps a single Prisma project → app Project
 */
export function mapPrismaProjectToProject(
  prismaProject: PrismaProject & { _count: { tasks: number } }
): Project & { taskCount: number } {
  const status = prismaProject.status as ProjectStatus;

  return {
    id: prismaProject.id,
    name: prismaProject.name,
    description: prismaProject.description ?? null,
    status,
    ownerId: prismaProject.ownerId,
    createdAt: prismaProject.createdAt,
    updatedAt: prismaProject.updatedAt,
    taskCount: prismaProject._count.tasks,
  };
}

/**
 * Maps multiple Prisma projects → app Projects[]
 */
export function mapPrismaProjectsToProjects(
  prismaProjects: (PrismaProject & { _count: { tasks: number } })[]
): (Project & { taskCount: number })[] {
  return prismaProjects.map(mapPrismaProjectToProject);
}
