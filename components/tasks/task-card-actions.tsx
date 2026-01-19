// components/tasks/task-card-actions.tsx (UPDATED)

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import type { TaskWithDetails } from "@/types/task";
import { Edit3, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardActionsProps {
  task: TaskWithDetails;
  onEditClick: () => void; // New callback
  onDeleteClick: () => void; // New callback
}

export function TaskCardActions({
  onEditClick,
  onDeleteClick,
}: TaskCardActionsProps) {
  const actionBtnClasses = (variant: "edit" | "delete") => cn(
    "h-8 w-8 p-0 rounded-md transition-all duration-200",
    "bg-transparent border border-transparent",
    variant === "edit" 
      ? "hover:bg-zinc-100 hover:text-zinc-950 hover:border-zinc-200" 
      : "hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20"
  );

  return (
    <div className="flex items-center gap-1.5">
      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onEditClick(); // Trigger the lifted state
        }}
        className={actionBtnClasses("edit")}
        title="Edit Task"
      >
        <Edit3 size={14} strokeWidth={2} />
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          onDeleteClick(); // Trigger the lifted state
        }}
        className={actionBtnClasses("delete")}
        title="Delete Task"
      >
        <Trash2 size={14} strokeWidth={2} />
      </Button>
    </div>
  );
}