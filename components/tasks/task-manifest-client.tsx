// components/tasks/task-manifest-client.tsx

"use client";

import * as React from "react";
import { GlobalTaskFilters } from "./global-task-filters";
import { TaskWithDetails, TaskStatus } from "@/types/task";
import { TaskCard } from "./task-card";

// 1. Define the specific shape of a task that includes its project relation
// This prevents the "Property 'project' does not exist" error
type TaskWithProjectRelation = TaskWithDetails & {
  project?: {
    id: string;
    name: string;
  } | null;
};

export function TaskManifestClient({ initialTasks }: { initialTasks: TaskWithDetails[] }) {
  const [filter, setFilter] = React.useState<TaskStatus | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Cast initialTasks to our extended type for internal logic
  const tasks = initialTasks as TaskWithProjectRelation[];

  // 1. Calculate counts based on ALL initial tasks
  const counts = React.useMemo(() => {
    return tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [tasks]);

  // 2. Filter tasks (Status + Search)
  const filteredTasks = React.useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = filter === "ALL" ? true : task.status === filter;
      
      // Fixed: Use optional chaining and nullish coalescing to avoid errors
      const taskTitle = task.title.toLowerCase();
      const projectName = (task.project?.name || "Independent_Operations").toLowerCase();
      const search = searchQuery.toLowerCase();

      const matchesSearch = taskTitle.includes(search) || projectName.includes(search);
      
      return matchesStatus && matchesSearch;
    });
  }, [tasks, filter, searchQuery]);

  // 3. Group the filtered results
  const groupedTasks = React.useMemo(() => {
    return filteredTasks.reduce((acc, task) => {
      const projectId = task.projectId || "independent";
      const projectName = task.project?.name || "Independent_Operations";
      
      if (!acc[projectId]) {
        acc[projectId] = { name: projectName, tasks: [] };
      }
      
      // Cast back to TaskWithDetails for compatibility with TaskCard
      acc[projectId].tasks.push(task as TaskWithDetails);
      return acc;
    }, {} as Record<string, { name: string; tasks: TaskWithDetails[] }>);
  }, [filteredTasks]);

  return (
    <div className="animate-in fade-in duration-700">
      <GlobalTaskFilters 
        currentStatus={filter} 
        onStatusChange={setFilter}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        counts={counts} 
      />
      
      {filteredTasks.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-white/5 rounded-3xl bg-zinc-900/20">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 italic">
            No_Matching_Sequences_Found
          </p>
        </div>
      ) : (
        <div className="space-y-16">
          {Object.entries(groupedTasks).map(([id, group]) => (
            <div key={id} className="space-y-6">
            {/* PROJECT HEADER - RESTORED EMERALD & INCREASED SIZE */}
            <div className="flex items-center gap-4">
              <div className="h-[1px] w-8 bg-emerald-500/50" />
              <h2 className="text-sm font-black uppercase tracking-[0.4em] text-emerald-400 whitespace-nowrap italic">
                {group.name}
              </h2>
              <div className="h-[1px] flex-1 bg-gradient-to-r from-emerald-500/20 to-transparent" />
              <span className="font-mono text-[11px] text-emerald-500/40 font-bold">
                [{group.tasks.length}_SEQUENCES]
              </span>
            </div>
          
            {/* TASK GRID */}
            <div className="grid gap-4 grid-cols-1 xl:grid-cols-2">
              {group.tasks.map(task => (
                <TaskCard 
                  key={task.id} 
                  task={task} 
                  canEdit={true} 
                  projectMembers={[]} 
                />
              ))}
            </div>
          </div>
          ))}
        </div>
      )}
    </div>
  );
}