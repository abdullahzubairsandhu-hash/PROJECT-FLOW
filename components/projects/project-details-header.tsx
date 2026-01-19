// components/projects/project-details-header.tsx

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { ProjectRoleBadge } from "./project-role-badge";
import { InviteMemberModal } from "./invite-member-modal";
import { EditProjectModal } from "./edit-project-modal";
import type { ProjectWithRole } from "@/types/project-member";
import { UserPlus, Calendar, ShieldCheck, CheckCircle2, Settings2 } from "lucide-react"; 

interface ProjectDetailsHeaderProps {
  project: ProjectWithRole;
  ownerName: string;
  canManageMembers: boolean;
}

export function ProjectDetailsHeader({
  project,
  ownerName,
  canManageMembers,
}: ProjectDetailsHeaderProps) {
  const [inviteModalOpen, setInviteModalOpen] = React.useState(false);
  const [editModalOpen, setEditModalOpen] = React.useState(false); // Placeholder for next step

  return (
    <>
      <div className="space-y-6 pb-8 border-b border-white/5 animate-in fade-in slide-in-from-top-2 duration-700">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
              <span className="hover:text-zinc-300 transition-colors cursor-default">Projects</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-400 font-mono tracking-tighter">{project.id.toUpperCase()}</span>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-100 italic uppercase">
                {project.name}
              </h1>
              <ProjectRoleBadge role={project.currentUserRole} />
            </div>

            <div className="flex flex-wrap items-center gap-y-3 gap-x-5 text-sm">
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md bg-zinc-900 border border-white/5">
                <ShieldCheck size={14} className="text-emerald-500" />
                <span className="text-zinc-300 font-medium text-xs uppercase tracking-wider">{ownerName}</span>
              </div>

              <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
                <CheckCircle2 size={14} className="text-zinc-600" />
                <span className="text-zinc-300">{project.taskCount.toString().padStart(2, '0')}</span>
                <span className="text-zinc-600 uppercase tracking-widest">Tasks_Logged</span>
              </div>

              <div className="flex items-center gap-2 text-zinc-500 font-mono text-xs">
                <Calendar size={14} className="text-zinc-600" />
                <span className="text-zinc-400">
                  {new Date(project.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  }).toUpperCase()}
                </span>
              </div>
            </div>
          </div>

          {/* 1. The Container: increased gap to gap-3 */}
          <div className="flex flex-col gap-3 shrink-0">
            {canManageMembers && (
              <Button
              onClick={() => setInviteModalOpen(true)}
              className="bg-zinc-100 text-zinc-950 hover:bg-white transition-all duration-300 font-black h-10 px-6 text-[10px] uppercase tracking-[0.2em] rounded-xl shadow-lg shadow-white/5"
              >
                <UserPlus size={14} className="mr-2" />
                Invite_Personnel
                </Button>
              )}
              
              <Button
              onClick={() => setEditModalOpen(true)}
              variant="outline"
              className="border-white/10 bg-zinc-900/50 text-zinc-400 hover:text-white hover:bg-zinc-900 hover:border-white/20 transition-all duration-300 font-black h-10 px-6 text-[10px] uppercase tracking-[0.2em] rounded-xl group"
              >
                <Settings2 size={14} className="mr-2 transition-transform duration-500 group-hover:rotate-90" />
                Modify_Parameters
                </Button>
                </div>
                </div>
                </div>
                <InviteMemberModal
                projectId={project.id}
                open={inviteModalOpen}
                onOpenChange={setInviteModalOpen}
                />
                {/* EditProjectModal will go here once created */}
                <EditProjectModal 
                project={project}
                open={editModalOpen}
                onOpenChange={setEditModalOpen}
                />
              </>
            );
              
}