// components/tasks/task-comment-actions.tsx

"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { deleteCommentAction } from "@/app/actions/task-comment-actions";
import { ProjectRole } from "@prisma/client";
import { cn } from "@/lib/utils";

interface TaskCommentActionsProps {
  commentId: string;
  projectId: string;
  taskId: string;
  userRole: ProjectRole;
  canEdit: boolean;
  canDelete: boolean;
  onEditClick: () => void;
}

export function TaskCommentActions({
  commentId,
  projectId,
  taskId,
  userRole,
  canEdit,
  canDelete,
  onEditClick,
}: TaskCommentActionsProps) {
  const [isPending, startTransition] = React.useTransition();

  if (!canEdit && !canDelete) return null;

  const onDelete = () => {
    // Note: In a full "Quiet Luxury" build, we'd use a custom Radix AlertDialog.
    // Keeping logic consistent but cleaning up the call.
    if (!window.confirm("PURGE_CONFIRMATION: Permanent deletion?")) return;
    
    startTransition(async () => {
      try {
        await deleteCommentAction(commentId, projectId, taskId, userRole);
      } catch (error) {
        console.error("DELETE_ERROR: Protocol interrupt", error);
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-7 w-7 p-0 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-all",
            isPending && "opacity-50 cursor-wait"
          )}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <MoreHorizontal className="h-4 w-4" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[140px] border-white/5 bg-zinc-950 p-1 shadow-2xl shadow-black"
      >
        {canEdit && (
          <DropdownMenuItem 
            onClick={onEditClick}
            className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-400 focus:bg-zinc-900 focus:text-zinc-100 cursor-pointer transition-colors"
          >
            <Pencil className="h-3.5 w-3.5" /> 
            Edit
          </DropdownMenuItem>
        )}
        {canDelete && (
          <DropdownMenuItem 
            onClick={onDelete}
            className="flex items-center gap-2 px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-red-500/70 focus:bg-red-500/10 focus:text-red-500 cursor-pointer transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" /> 
            Delete
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}