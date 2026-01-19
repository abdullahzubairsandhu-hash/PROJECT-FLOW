// components/tasks/delete-task-modal.tsx 

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { deleteTask } from "@/lib/tasks/task-actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { TaskWithDetails } from "@/types/task";
import { AlertCircle, Loader2, Trash2 } from "lucide-react";

interface DeleteTaskModalProps {
  task: TaskWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDeleted?: () => void;
}

export function DeleteTaskModal({
  task,
  open,
  onOpenChange,
  onDeleted,
}: DeleteTaskModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);

    const result = await deleteTask(task.id);

    setIsLoading(false);

    if (result.success) {
      onDeleted?.();
      onOpenChange(false);
      router.refresh();
    } else {
      setError(result.error || "DELETION_FAILED: Protocol interrupt");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] border-white/5 bg-zinc-950 p-6">
        <DialogHeader className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 mb-2">
            <Trash2 size={20} strokeWidth={1.5} />
          </div>
          <DialogTitle className="text-xl font-bold tracking-tight text-zinc-100">
            Terminate Task
          </DialogTitle>
          <DialogDescription className="text-zinc-500 text-sm leading-relaxed">
            This action is permanent. The task and all associated metadata will be purged from the workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <div className="rounded-xl bg-zinc-900/50 p-4 border border-white/5 transition-colors">
            <p className="font-bold text-[11px] uppercase tracking-widest text-zinc-500 mb-2">Task Context</p>
            <p className="font-semibold text-sm text-zinc-200">{task.title}</p>
            {task.description && (
              <p className="text-xs text-zinc-500 mt-2 line-clamp-2 italic">
                &quot;{task.description}&quot;
              </p>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-500/5 border border-red-500/20 p-3 animate-in fade-in zoom-in-95 duration-300">
              <div className="flex items-center gap-2">
                <AlertCircle size={14} className="text-red-500" />
                <p className="text-xs text-red-400 font-bold uppercase tracking-wider">{error}</p>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1 h-11 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900 font-bold text-[11px] uppercase tracking-[0.2em] transition-all"
            >
              Abort
            </Button>
            <Button
              type="button"
              onClick={handleDelete}
              disabled={isLoading}
              className="flex-[1.5] h-11 bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(220,38,38,0.2)] active:scale-[0.98] transition-all"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Confirm Delete"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}