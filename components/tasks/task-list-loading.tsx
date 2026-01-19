// components/tasks/task-list-loading.tsx 

"use client";

import * as React from "react";
import { TaskLoadingSkeleton } from "./task-loading-skeleton";
import { cn } from "@/lib/utils";

export function TaskListLoading() {
  const statuses = [
    { label: "Backlog", count: 3 },
    { label: "Active", count: 2 },
    { label: "Complete", count: 1 },
  ];

  return (
    <div className="space-y-12 animate-in fade-in duration-1000">
      {statuses.map((status, index) => (
        <div key={status.label} className="space-y-6">
          {/* Header Skeleton */}
          <div className="flex items-center gap-4 opacity-50">
            <div className="h-4 w-4 rounded bg-zinc-800 animate-pulse" />
            <div 
              className={cn(
                "h-3 w-24 rounded bg-zinc-800 animate-pulse",
                index === 1 && "w-20",
                index === 2 && "w-28"
              )} 
            />
            <div className="h-4 w-10 rounded-full bg-zinc-900 border border-white/5 animate-pulse" />
          </div>

          {/* Grid Skeleton */}
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: status.count }).map((_, i) => (
              <div 
                key={i} 
                className="transition-all"
                style={{ 
                  animationDelay: `${(index * 150) + (i * 100)}ms`,
                  animationFillMode: 'backwards' 
                }}
              >
                <TaskLoadingSkeleton />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}