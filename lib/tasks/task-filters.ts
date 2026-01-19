// lib/tasks/task-filters.ts

import type { TaskWithDetails, TaskStatus, TaskPriority } from "@/types/task";

export type TaskStatusFilter = TaskStatus | "ALL";
export type TaskPriorityFilter = TaskPriority | "ALL";
export type TaskSortBy = "created-desc" | "created-asc" | "priority" | "status";

export interface TaskFilterOptions {
  status: TaskStatusFilter;
  priority: TaskPriorityFilter;
  sortBy: TaskSortBy;
  search?: string;
}

export function filterAndSortTasks(
  tasks: TaskWithDetails[],
  filters: TaskFilterOptions
): TaskWithDetails[] {
  let filtered = [...tasks];

  // Filter by status
  if (filters.status !== "ALL") {
    filtered = filtered.filter((task) => task.status === filters.status);
  }

  // Filter by search
  if (filters.search) {
    const query = filters.search.toLowerCase();
    filtered = filtered.filter(task => task.title.toLowerCase().includes(query)
    );
  }
  
  // Filter by priority
  if (filters.priority !== "ALL") {
    filtered = filtered.filter((task) => task.priority === filters.priority);
  }

  // Sort
  filtered.sort((a, b) => {
    switch (filters.sortBy) {
      case "created-desc":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      
      case "created-asc":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      
      case "priority": {
        const priorityOrder = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      
      case "status": {
        const statusOrder = { TODO: 1, IN_PROGRESS: 2, DONE: 3 };
        return statusOrder[a.status] - statusOrder[b.status];
      }
      
      default:
        return 0;
    }
  });

  return filtered;
}