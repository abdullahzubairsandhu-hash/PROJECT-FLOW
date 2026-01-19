// components/projects/create-project-form.tsx

"use client";

import * as React from "react";
import { createProject } from "@/app/actions/project-actions";
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
import type { ProjectStatus } from "@/types/project";
import { Loader2, FolderPlus, AlertCircle, CheckCircle2 } from "lucide-react";

interface CreateProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateProjectForm({ open, onOpenChange }: CreateProjectFormProps) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const formRef = React.useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const result = await createProject({
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus,
    });

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      formRef.current?.reset();
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1200);
    } else {
      setError(result.error || "Failed to initialize project");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl border-white/5 bg-zinc-950 p-0 overflow-hidden shadow-2xl shadow-black">
        <DialogHeader className="p-8 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400">
              <FolderPlus size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-100">
                New Project
              </DialogTitle>
              <DialogDescription className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mt-0.5">
                Workspace Initialization
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
          {/* Project Name */}
          <div className="space-y-2">
            <Label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
              Project Name <span className="text-zinc-700">*</span>
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g., Global Expansion Phase I"
              required
              disabled={isLoading}
              maxLength={100}
              className="h-11 border-white/5 bg-zinc-900/50 focus:ring-1 focus:ring-zinc-700 transition-all placeholder:text-zinc-700"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
              Scope & Objectives
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Outline the key goals and deliverables..."
              disabled={isLoading}
              rows={4}
              className="border-white/5 bg-zinc-900/50 focus:ring-1 focus:ring-zinc-700 resize-none placeholder:text-zinc-700"
            />
          </div>

          {/* Status Select */}
          <div className="space-y-2">
            <Label htmlFor="status" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
              Initial Lifecycle Stage
            </Label>
            <Select
              id="status"
              name="status"
              required
              disabled={isLoading}
              defaultValue="PLANNING"
              className="h-11 border-white/5 bg-zinc-900/50 focus:ring-1 focus:ring-zinc-700"
            >
              <option value="PLANNING">Strategy & Planning</option>
              <option value="ACTIVE">Execution / Active</option>
              <option value="COMPLETED">Archival / Completed</option>
            </Select>
          </div>

          {/* Feedback Messages */}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/20 p-4 text-red-400 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 animate-in fade-in zoom-in-95">
              <CheckCircle2 size={16} />
              <p className="text-xs font-medium">Project infrastructure created successfully</p>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="text-zinc-500 hover:text-zinc-100 hover:bg-white/5 px-6 h-10 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-zinc-100 text-zinc-950 hover:bg-white px-8 h-10 text-xs font-bold transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Provisioning...</span>
                </div>
              ) : (
                "Create Project"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
