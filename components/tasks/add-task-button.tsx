// components/tasks/add-task-button.tsx (UPDATED - ADD LOADING STATE)

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { AddTaskModal } from "./add-task-modal";
import type { ProjectMember } from "@/types/project-member";
import { Plus } from "lucide-react";

interface AddTaskButtonProps {
  projectId: string;
  userId: string;
  projectMembers: ProjectMember[];
}

export function AddTaskButton({
  projectId,
  projectMembers,
}: AddTaskButtonProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="h-9 px-4 bg-zinc-100 text-zinc-950 hover:bg-white transition-all duration-200 shadow-[0_1px_10px_rgba(255,255,255,0.1)] active:scale-[0.98] group"
      >
        <span className="flex items-center gap-2">
          <Plus 
            size={14} 
            strokeWidth={3} 
            className="text-zinc-950 transition-transform duration-300 group-hover:rotate-90" 
          />
          <span className="text-[11px] font-bold uppercase tracking-widest">
            New Task
          </span>
        </span>
      </Button>
      <AddTaskModal
        projectId={projectId}
        open={open}
        onOpenChange={setOpen}
        projectMembers={projectMembers}
      />
    </>
  );
}