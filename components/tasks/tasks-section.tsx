// components/tasks/tasks-section.tsx 

import { getProjectTasks, getUserTasks } from "@/lib/tasks/task-queries";
import { getProjectMembers } from "@/lib/projects/project-members";
import { canCreateTasks, canEditTasks } from "@/lib/projects/project-role";
import type { TaskWithDetails } from "@/types/task";
import { TaskListWithFilters } from "./task-list-with-filters";
import { AddTaskButton } from "./add-task-button";
import type { ProjectMember } from "@/types/project-member";
import { Terminal } from "lucide-react";
import { cn } from "@/lib/utils"; // Actively used below

interface TasksSectionProps {
  projectId?: string;
  userId: string;
  userRole?: string;
}

export async function TasksSection({
  projectId,
  userId,
  userRole,
}: TasksSectionProps) {
  let tasks: TaskWithDetails[] = [];
  let members: ProjectMember[] = [];

  try {
    if (projectId) {
      tasks = await getProjectTasks(projectId, userId);
    } else {
      tasks = await getUserTasks(userId);
    }
  } catch (error) {
    console.error("SYS_LOG: Task fetch failure", error);
  }

  if (projectId) {
    try {
      members = await getProjectMembers(projectId, userId);
    } catch (error) {
      console.error("SYS_LOG: Member fetch failure", error);
    }
  }

  const userCanCreateTasks =
    projectId && userRole
      ? canCreateTasks(userRole as "OWNER" | "ADMIN" | "MEMBER" | "VIEWER")
      : false;

  const userCanEditTasks =
    projectId && userRole
      ? canEditTasks(userRole as "OWNER" | "ADMIN" | "MEMBER" | "VIEWER")
      : false;

  return (
    <section className={cn("py-8", "space-y-12")}>
      {/* Header Module */}
      <div className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-8 pb-10",
        "border-b border-white/[0.03]"
      )}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">
              Operational Environment
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center h-12 w-12 rounded-2xl bg-zinc-900 border border-white/5 shadow-inner">
              <Terminal size={22} className="text-zinc-100" />
            </div>
            <h2 className="text-4xl font-black tracking-tighter text-zinc-100 uppercase italic">
              Tasks
            </h2>
          </div>
          
          <p className="text-xs font-medium text-zinc-500 max-w-sm leading-relaxed mt-4">
            Unified management of computational threads and development objectives.
          </p>
        </div>

        {/* Global Action Area - Fixed to prevent button doubling */}
        <div className="flex items-center">
        {projectId && userCanCreateTasks && (
          <AddTaskButton 
          projectId={projectId} 
          userId={userId}
          projectMembers={members} 
          />
          )}
          </div>
         </div>

      {/* Content Container */}
      <div className="relative pt-2">
        {/* The Vertical continuity line used with cn for visibility logic */}
        <div className={cn(
          "absolute left-[-24px] top-0 bottom-0 w-px",
          "bg-gradient-to-b from-white/10 via-white/[0.02] to-transparent",
          "hidden xl:block"
        )} />
        
        <TaskListWithFilters
          tasks={tasks}
          canEdit={userCanEditTasks}
          projectMembers={members}
        />
      </div>
    </section>
  );
}