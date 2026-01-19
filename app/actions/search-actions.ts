// app/actions/search-actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";

export async function getGlobalSearchResults(query: string) {
  // Guard for short queries
  if (!query || query.length < 2) {
    return { projects: [], tasks: [], members: [] };
  }
  
  const user = await requireUser();

  try {
    // Perform concurrent searches
    const [projects, tasks, members] = await Promise.all([
      // 1. Search Projects where the user is a member
      prisma.project.findMany({
        where: {
          name: { contains: query, mode: 'insensitive' },
          members: { some: { userId: user.id } }
        },
        take: 5,
        select: { id: true, name: true }
      }),

      // 2. Search Tasks belonging to user's projects
      prisma.task.findMany({
        where: {
          title: { contains: query, mode: 'insensitive' },
          project: { members: { some: { userId: user.id } } }
        },
        take: 5,
        select: { id: true, title: true, projectId: true }
      }),

      // 3. Search Users (Global Directory)
      prisma.user.findMany({
        where: {
          OR: [
            { firstName: { contains: query, mode: 'insensitive' } },
            { lastName: { contains: query, mode: 'insensitive' } },
            { email: { contains: query, mode: 'insensitive' } },
          ],
        },
        take: 5,
        select: { id: true, firstName: true, lastName: true, email: true }
      }),
    ]);

    return { projects, tasks, members };
  } catch (error) {
    console.error("SEARCH_ACTION_ERROR:", error);
    return { projects: [], tasks: [], members: [] };
  }
}