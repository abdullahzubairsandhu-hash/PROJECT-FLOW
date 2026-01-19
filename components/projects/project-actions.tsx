// components/projects/project-actions.tsx

"use client";

import * as React from "react";
// import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { deleteProject, updateProjectStatus } from "@/app/actions/project-actions";
import type { ProjectStatus } from "@/types/project";
import { MoreHorizontal, Trash2, ArrowRightCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectActionsProps {
  projectId: string;
  projectStatus: ProjectStatus;
}

export function ProjectActions({ projectId, projectStatus }: ProjectActionsProps) {
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // In a full premium build, you'd use a custom AlertDialog here
    if (!confirm("Are you sure you want to delete this project?")) return;

    setIsDeleting(true);
    const result = await deleteProject(projectId);

    if (!result.success) {
      console.error(result.error);
      setIsDeleting(false);
    }
  };

  const handleStatusToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const nextStatus: ProjectStatus = 
      projectStatus === "PLANNING" ? "ACTIVE" :
      projectStatus === "ACTIVE" ? "COMPLETED" :
      "PLANNING";

    setIsUpdating(true);
    const result = await updateProjectStatus(projectId, nextStatus);
    
    if (!result.success) console.error(result.error);
    setIsUpdating(false);
  };

  return (
    <div className="flex items-center gap-2 w-full relative z-20">
      {/* Primary Action: Status Advance */}
      <Button
        variant="secondary"
        size="sm"
        className="flex-[2] h-8 bg-zinc-800/50 hover:bg-zinc-700/50 border-white/5 text-zinc-300 hover:text-white transition-all duration-300"
        onClick={handleStatusToggle}
        disabled={isUpdating}
      >
        {isUpdating ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <div className="flex items-center gap-2">
            <ArrowRightCircle size={14} className="text-zinc-500" />
            <span className="text-[11px] font-bold uppercase tracking-wider">
              {projectStatus === "COMPLETED" ? "Restart" : "Advance"}
            </span>
          </div>
        )}
      </Button>

      {/* Secondary Action: Delete */}
      <Button
        variant="ghost"
        size="sm"
        className={cn(
          "flex-1 h-8 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors duration-300",
          isDeleting && "text-red-400 bg-red-500/10"
        )}
        onClick={handleDelete}
        disabled={isDeleting}
      >
        {isDeleting ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Trash2 size={14} />
        )}
      </Button>

      {/* Overflow for future actions like "Archive" or "Export" */}
      <Button
        variant="ghost"
        size="sm"
        className="px-2 h-8 text-zinc-600 hover:text-zinc-300"
      >
        <MoreHorizontal size={14} />
      </Button>
    </div>
  );
}