// components/tasks/task-priority-indicator.tsx

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { TaskPriority } from "@/types/task";

interface TaskPriorityIndicatorProps {
  priority: TaskPriority;
  className?: string;
}

const priorityConfig: Record<
  TaskPriority,
  { label: string; container: string; barCount: number; color: string }
> = {
  LOW: {
    label: "Low Priority",
    container: "text-zinc-500",
    barCount: 1,
    color: "bg-zinc-600",
  },
  MEDIUM: {
    label: "Med Priority",
    container: "text-zinc-400",
    barCount: 2,
    color: "bg-zinc-400",
  },
  HIGH: {
    label: "High Priority",
    container: "text-zinc-100",
    barCount: 3,
    color: "bg-zinc-100",
  },
};

export function TaskPriorityIndicator({
  priority,
  className,
}: TaskPriorityIndicatorProps) {
  const config = priorityConfig[priority];

  return (
    <div 
      className={cn(
        "inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest", 
        config.container,
        className
      )}
    >
      {/* Visual Signal Bars */}
      <div className="flex gap-0.5 items-end h-2.5">
        {[1, 2, 3].map((bar) => (
          <div
            key={bar}
            className={cn(
              "w-[3px] rounded-full transition-all duration-500",
              bar <= config.barCount ? config.color : "bg-zinc-800",
              // Varying heights for a "signal" look
              bar === 1 && "h-1.5",
              bar === 2 && "h-2",
              bar === 3 && "h-2.5"
            )}
          />
        ))}
      </div>
      
      <span>{config.label}</span>
    </div>
  );
}