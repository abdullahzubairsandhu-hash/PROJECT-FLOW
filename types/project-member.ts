// types/project-member.ts

import { Project } from "./project"; // ✅ Import the base Project type

export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectRole;
  createdAt: Date | string; // ✅ Updated to match serialized Next.js data
  user: {
    id: string;
    email: string;
    name: string | null;
    imageUrl: string | null;
  };
}

/**
 * ✅ THE KEY FIX: Instead of redefining everything, we extend 'Project'.
 * This ensures that if 'Project' allows 'Date | string', this does too.
 */
export type ProjectWithRole = Project & {
  currentUserRole: ProjectRole;
};