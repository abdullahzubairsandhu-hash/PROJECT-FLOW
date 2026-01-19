// components/projects/invite-member-modal.tsx

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { addProjectMemberByEmail } from "@/app/actions/project-member-actions";
import type { ProjectRole } from "@/types/project-member";
import { Loader2, UserPlus, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";

interface InviteMemberModalProps {
  projectId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InviteMemberModal({
  projectId,
  open,
  onOpenChange,
}: InviteMemberModalProps) {
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
    const result = await addProjectMemberByEmail(
      projectId, 
      formData.get("email") as string, 
      formData.get("role") as ProjectRole
    );

    setIsLoading(false);

    if (result.success) {
      setSuccess(true);
      formRef.current?.reset();
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 1200);
    } else {
      setError(result.error || "Failed to deliver invitation");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border-white/5 bg-zinc-950 p-0 overflow-hidden shadow-2xl shadow-black">
        <DialogHeader className="p-8 pb-0">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400">
              <UserPlus size={20} />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold tracking-tight text-zinc-100">
                Add Collaborator
              </DialogTitle>
              <DialogDescription className="text-[10px] text-zinc-500 uppercase tracking-[0.2em] font-bold mt-0.5">
                Access Control Protocol
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form ref={formRef} onSubmit={handleSubmit} className="p-8 pt-6 space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@company.com"
              required
              disabled={isLoading}
              className="h-11 border-white/5 bg-zinc-900/50 focus:ring-1 focus:ring-zinc-700 transition-all placeholder:text-zinc-700"
            />
          </div>

          {/* Role Selection */}
          <div className="space-y-2">
            <Label htmlFor="role" className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 ml-1">
              Permission Level
            </Label>
            <Select
              id="role"
              name="role"
              required
              disabled={isLoading}
              defaultValue="MEMBER"
              className="h-11 border-white/5 bg-zinc-900/50 focus:ring-1 focus:ring-zinc-700"
            >
              <option value="ADMIN">Administrator</option>
              <option value="MEMBER">Standard Member</option>
              <option value="VIEWER">Read-Only Viewer</option>
            </Select>
          </div>

          {/* Minimalist Permission Note */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-zinc-900/30 border border-white/5 text-zinc-500">
            <ShieldCheck size={14} className="mt-0.5 text-zinc-400" />
            <p className="text-[11px] leading-relaxed">
              Invitations are valid for 7 days. Assigning a role grants immediate access to all project assets and task history.
            </p>
          </div>

          {/* Feedback */}
          {error && (
            <div className="flex items-center gap-2 rounded-md bg-red-500/10 border border-red-500/20 p-4 text-red-400 animate-in fade-in slide-in-from-top-1">
              <AlertCircle size={16} />
              <p className="text-xs font-medium">{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2 rounded-md bg-emerald-500/10 border border-emerald-500/20 p-4 text-emerald-400 animate-in fade-in zoom-in-95">
              <CheckCircle2 size={16} />
              <p className="text-xs font-medium">Invitation dispatched</p>
            </div>
          )}

          {/* Actions */}
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
              className="bg-zinc-100 text-zinc-950 hover:bg-white px-8 h-10 text-xs font-bold transition-all"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Inviting...</span>
                </div>
              ) : (
                "Send Invite"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}