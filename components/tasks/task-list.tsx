// components/tasks/task-list.tsx 

"use client";

import * as React from "react";
import { TaskCard } from "./task-card";
import { EmptyTaskState } from "./empty-task-state";
import type { TaskWithDetails, TaskStatus } from "@/types/task";
import { 
  Circle, 
  CircleDot, 
  CheckCircle2, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskListProps {
  tasks: TaskWithDetails[];
  canEdit?: boolean;
  projectMembers?: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  }>;
}

const statusOrder: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

const statusConfig: Record<TaskStatus, { label: string; icon: React.ElementType; color: string }> = {
  TODO: { 
    label: "Backlog", 
    icon: Circle, 
    color: "text-zinc-500" 
  },
  IN_PROGRESS: { 
    label: "Active Operations", 
    icon: CircleDot, 
    color: "text-zinc-100" // Subdued but primary
  },
  DONE: { 
    label: "Terminal State", 
    icon: CheckCircle2, 
    color: "text-zinc-600" // Less visual weight for completed items
  },
};

export function TaskList({ tasks, canEdit = false, projectMembers = [] }: TaskListProps) {
  if (!tasks || tasks.length === 0) {
    return <EmptyTaskState />;
  }

  const tasksByStatus = tasks.reduce(
    (acc, task) => {
      const status = task.status || "TODO";
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(task);
      return acc;
    },
    {} as Record<TaskStatus, TaskWithDetails[]>
  );

  statusOrder.forEach((status) => {
    if (tasksByStatus[status]) {
      tasksByStatus[status].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
  });

  return (
    <div className="space-y-16">
      {statusOrder.map((status) => {
        const statusTasks = tasksByStatus[status] || [];
        if (statusTasks.length === 0) return null;

        const config = statusConfig[status];
        const Icon = config.icon;

        return (
          <div
            key={status}
            className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-1000"
          >
            {/* High-End Section Header */}
            <div className="flex items-center justify-between border-b border-white/[0.03] pb-3">
              <div className="flex items-center gap-4">
                <div className={cn(
                  "flex items-center justify-center h-8 w-8 rounded-lg bg-zinc-900/50 border border-white/5 shadow-inner",
                  config.color
                )}>
                  <Icon size={14} strokeWidth={2.5} />
                </div>
                
                <div className="flex flex-col">
                  <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-100">
                    {config.label}
                  </h2>
                  <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">
                    {statusTasks.length} {statusTasks.length === 1 ? "Component" : "Components"}
                  </p>
                </div>
              </div>
              
              <button className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-zinc-600 hover:text-zinc-300 transition-all">
                <span>View Full Log</span>
                <ChevronRight 
                  size={12} 
                  className="group-hover:translate-x-1 transition-transform" 
                />
              </button>
            </div>

            {/* Task Grid - Optimized Spacing */}
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {statusTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  canEdit={canEdit}
                  projectMembers={projectMembers}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}