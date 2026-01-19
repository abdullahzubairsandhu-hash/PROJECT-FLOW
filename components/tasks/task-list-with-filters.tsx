// components/tasks/task-list-with-filters.tsx 

"use client";

import * as React from "react";
import { TaskList } from "./task-list";
import { TaskFilters } from "./task-filters";
import { filterAndSortTasks } from "@/lib/tasks/task-filters";
import type { TaskWithDetails } from "@/types/task";
import type { TaskFilterOptions } from "@/lib/tasks/task-filters";
import type { ProjectMember } from "@/types/project-member";
import { Layers, ListFilter } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskListWithFiltersProps {
  tasks: TaskWithDetails[];
  canEdit?: boolean;
  projectMembers?: ProjectMember[];
}

export function TaskListWithFilters({
  tasks,
  canEdit = false,
  projectMembers = [],
}: TaskListWithFiltersProps) {
  const [filters, setFilters] = React.useState<TaskFilterOptions>({
    status: "ALL",
    priority: "ALL",
    sortBy: "created-desc",
    search: "",
  });

  const filteredTasks = React.useMemo(() => {
    return filterAndSortTasks(tasks, filters);
  }, [tasks, filters]);

  const activeFilterCount = React.useMemo(() => {
    let count = 0;
    if (filters.status !== "ALL") count++;
    if (filters.priority !== "ALL") count++;
    if (filters.sortBy !== "created-desc") count++;
    if (filters.search) count++;
    return count;
  }, [filters]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Dynamic Status Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-900/50 border border-white/5">
            <Layers size={12} className="text-zinc-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-400">
              Total Indices: {tasks.length}
            </span>
          </div>
          
          <div className="h-4 w-px bg-zinc-800 hidden sm:block" />

          <p className="text-[11px] font-medium text-zinc-500 uppercase tracking-tight">
            Displaying <span className="text-zinc-200">{filteredTasks.length}</span> entries
          </p>
        </div>

        {/* Active Filter Badge */}
        <div 
          className={cn(
            "flex items-center gap-2 transition-all duration-500",
            activeFilterCount > 0 ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"
          )}
        >
          <div className="flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-1.5 shadow-xl shadow-black/20">
            <ListFilter size={12} className="text-zinc-950" />
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-950">
              {activeFilterCount} Active Parameters
            </span>
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <TaskFilters filters={filters} onFiltersChange={setFilters} />

      {/* Results View */}
      <TaskList
        tasks={filteredTasks}
        canEdit={canEdit}
        projectMembers={projectMembers.map(member => ({
          ...member,
          user: {
            ...member.user,
            firstName: member.user.name || null,
            lastName: null,
          },
        }))}
      />
    </div>
  );
}