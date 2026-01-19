// types/project-member.ts

export type ProjectRole = "OWNER" | "ADMIN" | "MEMBER" | "VIEWER";

export interface ProjectMember {
  id: string;
  userId: string;
  projectId: string;
  role: ProjectRole;
  createdAt: Date;
  user: {
    id: string;
    email: string;
    name: string | null;
    imageUrl: string | null;
  };
}

export interface ProjectWithRole {
  id: string;
  name: string;
  description: string | null;
  status: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  taskCount: number;
  currentUserRole: ProjectRole;
}