// components/tasks/edit-task-modal.tsx 

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { updateTask } from "@/lib/tasks/task-actions";
import { getProjectMembersAction } from "@/app/actions/project-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { 
  Loader2, 
  Check, 
  AlertCircle, 
  Activity, 
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TaskWithDetails, TaskStatus, TaskPriority } from "@/types/task";

// 1. DEFINE THE MEMBER INTERFACE TO KILL THE 'ANY' ERRORS
interface ProjectMemberData {
  userId: string;
  user: {
    id: string;
    name?: string | null;
    email?: string;
    firstName?: string | null;
    lastName?: string | null;
  };
}

interface EditTaskModalProps {
  task: TaskWithDetails;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Use the interface here instead of any[]
  projectMembers?: ProjectMemberData[];
}

export function EditTaskModal({
  task,
  open,
  onOpenChange,
  projectMembers = [],
}: EditTaskModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetchingMembers, setIsFetchingMembers] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  
  // 2. USE THE INTERFACE IN THE STATE
  const [dynamicMembers, setDynamicMembers] = React.useState<ProjectMemberData[]>(projectMembers);

  React.useEffect(() => {
    async function loadMembers() {
      if (open && task.projectId) {
        setIsFetchingMembers(true);
        const result = await getProjectMembersAction(task.projectId);
        if (result.success && result.members) {
          // 3. CAST TO THE INTERFACE
          setDynamicMembers(result.members as ProjectMemberData[]);
        }
        setIsFetchingMembers(false);
      }
    }
    loadMembers();
  }, [open, task.projectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await updateTask(task.id, {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as TaskStatus,
      priority: formData.get("priority") as TaskPriority,
      dueDate: formData.get("dueDate") ? new Date(formData.get("dueDate") as string) : undefined,
      assigneeId: (formData.get("assigneeId") as string) || undefined,
    });

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
        router.refresh();
      }, 800);
    } else {
      setError(result.error || "UPDATE_FAILED: System interrupt");
    }
  };

  const defaultDueDate = task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className={cn(
          "fixed left-[50%] top-[50%] z-[100] translate-x-[-50%] translate-y-[-50%]",
          "max-w-2xl w-full border-white/5 bg-zinc-950 p-0 shadow-2xl rounded-2xl overflow-hidden"
        )}
      >
        <div className="max-h-[85vh] overflow-y-auto p-8 text-zinc-100">
          <DialogHeader className="space-y-3 text-left">
            <div className="flex items-center gap-2 text-emerald-500/80">
              <Activity size={14} className="animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">System_Update</span>
            </div>
            <DialogTitle className="text-2xl font-black tracking-tight text-white uppercase italic">
              {task.title || "Manifest_Entry"}
            </DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium text-xs">
              Adjusting operational parameters for sequence <span className="text-zinc-300 font-mono">#{task.id.slice(-4)}</span>
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-8 mt-8">
            <div className={cn("space-y-6", isLoading && "opacity-50")}>
              
              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Title</label>
                <Input
                  name="title"
                  defaultValue={task.title}
                  disabled={isLoading}
                  className="h-12 bg-zinc-900/40 border-white/5 focus:border-emerald-500/50 focus:ring-0 text-zinc-100 rounded-xl outline-none"
                />
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Log Description</label>
                <Textarea
                  name="description"
                  defaultValue={task.description || ""}
                  disabled={isLoading}
                  rows={3}
                  className="bg-zinc-900/40 border-white/5 focus:border-emerald-500/50 focus:ring-0 text-zinc-100 rounded-xl resize-none outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Status</label>
                  <select name="status" defaultValue={task.status} disabled={isLoading} className="w-full h-12 bg-zinc-900/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-zinc-200 outline-none focus:border-emerald-500/50 appearance-none">
                    <option value="TODO">Backlog</option>
                    <option value="IN_PROGRESS">Active</option>
                    <option value="DONE">Complete</option>
                  </select>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">Priority</label>
                  <select name="priority" defaultValue={task.priority} disabled={isLoading} className="w-full h-12 bg-zinc-900/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-zinc-200 outline-none focus:border-emerald-500/50 appearance-none">
                    <option value="LOW">Low_Tier</option>
                    <option value="MEDIUM">Mid_Tier</option>
                    <option value="HIGH">High_Tier</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2.5">
                  <label className="flex items-center h-4 text-[10px] font-black uppercase tracking-widest text-emerald-500/50 ml-1">Deadline</label>
                  <Input
                    name="dueDate"
                    type="date"
                    defaultValue={defaultDueDate}
                    disabled={isLoading}
                    className="h-12 bg-zinc-900/40 border-white/5 text-zinc-200 rounded-xl [color-scheme:dark] outline-none"
                  />
                </div>
                <div className="space-y-2.5">
                  <label className="flex items-center justify-between h-4 text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-1">
                    Personnel
                    {isFetchingMembers && <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />}
                  </label>
                  <select 
                    name="assigneeId" 
                    defaultValue={task.assigneeId || ""} 
                    disabled={isLoading || isFetchingMembers} 
                    className="w-full h-12 bg-zinc-900/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-zinc-200 outline-none appearance-none"
                  >
                    <option value="">Unassigned</option>
                    {dynamicMembers.map((m) => (
                      <option key={m.userId} value={m.userId}>
                        {m.user?.name || m.user?.email?.split("@")[0] || "Unknown User"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/5 border border-red-500/10 rounded-xl flex items-center gap-3">
                <AlertCircle size={14} className="text-red-500" />
                <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">{error}</span>
              </div>
            )}

            {success && (
              <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl flex items-center gap-3">
                <Check size={14} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Database_Synchronized</span>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
                className="flex-1 h-14 rounded-xl border border-white/5 text-[11px] font-black uppercase tracking-widest text-zinc-500 hover:text-white"
              >
                Abort
              </Button>
              <Button
                type="submit"
                disabled={isLoading || isFetchingMembers}
                className="flex-1 h-14 rounded-xl bg-emerald-500 text-zinc-950 hover:bg-emerald-400 font-black text-[11px] uppercase tracking-widest transition-all"
              >
                {isLoading ? <Loader2 size={18} className="animate-spin" /> : "Commit Changes"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}