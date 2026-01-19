// types/project.ts

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
  taskCount: number; 
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