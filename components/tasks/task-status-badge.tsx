// components/tasks/task-status-badge.tsx

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { updateTaskStatus as updateTaskStatusAction } from "@/lib/tasks/task-actions";
import type { TaskStatus } from "@/types/task";
import { Loader2, Circle, Clock, CheckCircle2 } from "lucide-react";

interface TaskStatusBadgeProps {
  taskId: string;
  status: TaskStatus;
  canEdit: boolean;
  className?: string;
}

const statusConfig: Record<
  TaskStatus,
  {
    label: string;
    icon: React.ElementType;
    colorClass: string;
    next: TaskStatus;
  }
> = {
  TODO: {
    label: "Backlog",
    icon: Circle,
    colorClass: "text-zinc-500 border-white/5 bg-zinc-900/40 hover:text-zinc-300",
    next: "IN_PROGRESS",
  },
  IN_PROGRESS: {
    label: "Active",
    icon: Clock,
    colorClass: "text-blue-400 border-blue-500/10 bg-blue-500/5 hover:text-blue-300 hover:bg-blue-500/10",
    next: "DONE",
  },
  DONE: {
    label: "Complete",
    icon: CheckCircle2,
    colorClass: "text-emerald-500 border-emerald-500/10 bg-emerald-500/5 hover:text-emerald-400 hover:bg-emerald-500/10",
    next: "TODO",
  },
};

export function TaskStatusBadge({
  taskId,
  status,
  canEdit,
  className,
}: TaskStatusBadgeProps) {
  const [currentStatus, setCurrentStatus] = React.useState<TaskStatus>(status);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const config = statusConfig[currentStatus];
  const Icon = config.icon;

  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canEdit || isUpdating) return;

    const nextStatus = config.next;
    
    // Optimistic Update
    setCurrentStatus(nextStatus);
    setIsUpdating(true);

    try {
      const result = await updateTaskStatusAction(taskId, nextStatus);
      if (!result.success) {
        throw new Error(result.error);
      }
    } catch (error) {
      // Revert on failure
      setCurrentStatus(status);
      console.error("SYNC_ERROR: Status update failed", error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!canEdit || isUpdating}
      className={cn(
        "group inline-flex items-center gap-2 rounded-full border px-2.5 py-1 transition-all duration-300",
        config.colorClass,
        canEdit && !isUpdating ? "cursor-pointer active:scale-95" : "cursor-default",
        isUpdating && "opacity-50 grayscale cursor-wait",
        className
      )}
    >
      <div className="flex items-center justify-center">
        {isUpdating ? (
          <Loader2 size={11} className="animate-spin" />
        ) : (
          <Icon size={11} strokeWidth={3} className="transition-transform group-hover:rotate-12" />
        )}
      </div>
      <span className="text-[9px] font-black uppercase tracking-[0.15em]">
        {config.label}
      </span>
    </button>
  );
}