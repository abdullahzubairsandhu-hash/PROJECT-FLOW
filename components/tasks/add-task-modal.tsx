// components/tasks/add-task-modal.tsx

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { createTask } from "@/lib/tasks/task-actions";
import { getProjectMembersAction } from "@/app/actions/project-actions"; // Corrected path
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { TaskStatus, TaskPriority } from "@/types/task";
import type { ProjectMember } from "@/types/project-member";
import { Loader2, Plus, AlertCircle, CheckCircle2, Box } from "lucide-react";

interface AddTaskModalProps {
  projectId?: string;
  projects?: { id: string; name: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectMembers?: ProjectMember[];
}

export function AddTaskModal({
  projectId: initialProjectId,
  projects = [],
  open,
  onOpenChange,
  projectMembers = [],
}: AddTaskModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);
  const [isFetchingMembers, setIsFetchingMembers] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);
  
  const [selectedProjectId, setSelectedProjectId] = React.useState(initialProjectId || "");
  // New state to hold members for the selected project
  const [dynamicMembers, setDynamicMembers] = React.useState<ProjectMember[]>(projectMembers);

  const isGlobalMode = !initialProjectId;

  // Sync state if initialProjectId changes
  React.useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
      setDynamicMembers(projectMembers);
    }
  }, [initialProjectId, projectMembers]);

  // FETCH MEMBERS WHEN PROJECT CHANGES
  React.useEffect(() => {
    async function loadMembers() {
      if (isGlobalMode && selectedProjectId) {
        setIsFetchingMembers(true);
        const result = await getProjectMembersAction(selectedProjectId);
        if (result.success && result.members) {
          setDynamicMembers(result.members as ProjectMember[]);
        } else {
          setDynamicMembers([]);
        }
        setIsFetchingMembers(false);
      }
    }
    loadMembers();
  }, [selectedProjectId, isGlobalMode]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProjectId) {
      setError("Please select a target project.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createTask(selectedProjectId, {
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
      setError(result.error || "Failed to create task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-white/5 bg-zinc-950 p-0 overflow-hidden shadow-2xl shadow-black">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-100">
            {isGlobalMode ? "Initialize Global Task" : "New Project Task"}
          </DialogTitle>
          <DialogDescription className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold mt-1">
            {isGlobalMode ? "Select project context to begin" : `Project Workspace — ${initialProjectId?.slice(0, 8)}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-6 pt-4 space-y-5">
          
          {isGlobalMode && (
            <div className="space-y-2 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
              <Label className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                <Box size={12} />
                Target Project Registry
              </Label>
              <select 
                required
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                disabled={isLoading}
                className="w-full bg-transparent border-none focus:ring-0 text-zinc-200 font-medium text-sm outline-none cursor-pointer"
              >
                <option value="" disabled className="bg-zinc-950 text-zinc-500">Select project context...</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-zinc-950 text-zinc-200">{p.name}</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Title</Label>
            <Input id="title" name="title" placeholder="What needs to be done?" required disabled={isLoading} className="h-10 border-white/5 bg-zinc-900/50 focus:ring-1 focus:ring-zinc-700 placeholder:text-zinc-600" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Description</Label>
            <Textarea id="description" name="description" placeholder="Add context..." disabled={isLoading} className="min-h-[100px] border-white/5 bg-zinc-900/50 focus:ring-1 focus:ring-zinc-700 resize-none placeholder:text-zinc-600" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Status</Label>
              <Select id="status" name="status" defaultValue="TODO" disabled={isLoading} className="border-white/5 bg-zinc-900/50">
                <option value="TODO">To Do</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="DONE">Done</option>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500">Priority</Label>
              <Select id="priority" name="priority" defaultValue="MEDIUM" disabled={isLoading} className="border-white/5 bg-zinc-900/50">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate" className="flex items-center h-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">Due Date</Label>
              <Input id="dueDate" name="dueDate" type="date" disabled={isLoading} className="h-10 border-white/5 bg-zinc-900/50 [color-scheme:dark]" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assigneeId" className="flex items-center justify-between h-3 text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                Assignee
                {isFetchingMembers && <Loader2 className="h-3 w-3 animate-spin text-emerald-500" />}
              </Label>
              <Select 
                id="assigneeId" 
                name="assigneeId" 
                disabled={isLoading || isFetchingMembers || !selectedProjectId} 
                className={`border-white/5 bg-zinc-900/50 ${!selectedProjectId ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <option value="">Unassigned</option>
                {dynamicMembers.map((member) => (
                  <option key={member.userId} value={member.userId}>
                    {member.user.name || member.user.email.split("@")[0]}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/20 p-3 text-red-400">
              <AlertCircle size={14} />
              <p className="text-[12px] font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 p-3 text-emerald-400">
              <CheckCircle2 size={14} />
              <p className="text-[12px] font-medium">Task successfully created</p>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading} className="text-zinc-400 hover:text-zinc-100 hover:bg-white/5 px-6 h-9 text-xs font-semibold">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || isFetchingMembers} className="bg-zinc-100 text-zinc-950 hover:bg-white px-6 h-9 text-xs font-bold transition-all">
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : <Plus className="h-3 w-3 mr-2" strokeWidth={3} />}
              Create Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}