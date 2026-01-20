// types/project.ts

import { ProjectRole } from "./project-member";
export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
  ownerId: string;
  taskCount: number; 
  currentUserRole?: ProjectRole;
}

export type ProjectStatus = "PLANNING" | "ACTIVE" | "COMPLETED";

export interface CreateProjectInput {
  name: string;
  description?: string;
  status: ProjectStatus;
}

export interface ProjectActionResult {
  success: boolean;
  error?: string;
  projectId?: string;
}