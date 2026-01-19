// components/projects/project-members.tsx

"use client";

import * as React from "react";
import { ProjectRoleBadge } from "./project-role-badge";
import type { ProjectMember, ProjectRole } from "@/types/project-member";
import Image from "next/image";
import { Mail, Users } from "lucide-react";

interface ProjectMembersProps {
  members: ProjectMember[];
}

function MemberItem({ member }: { member: ProjectMember }) {
  // Aligned with your interface: using member.user.name
  const displayName = member.user.name || member.user.email.split("@")[0];

  const initials = React.useMemo(() => {
    if (member.user.name) {
      const names = member.user.name.split(" ");
      return names.map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    return member.user.email.charAt(0).toUpperCase();
  }, [member.user.name, member.user.email]);

  return (
    <div className="group flex items-center justify-between p-4 rounded-xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/60 transition-all duration-300 w-full">
      <div className="flex items-center gap-4 min-w-0">
        <div className="relative shrink-0">
          {member.user.imageUrl ? (
            <div className="h-11 w-11 rounded-full border border-white/10 overflow-hidden grayscale-[0.3] group-hover:grayscale-0 transition-all">
              <Image
                src={member.user.imageUrl}
                alt={displayName}
                width={44}
                height={44}
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-11 w-11 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
              <span className="text-zinc-400 text-xs font-black">{initials}</span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-[13px] font-bold text-zinc-100 group-hover:text-white transition-colors truncate">
            {displayName}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-medium">
            <Mail size={10} className="text-zinc-600" />
            <span className="truncate">{member.user.email}</span>
          </div>
        </div>
      </div>

      <div className="shrink-0 ml-4">
        <ProjectRoleBadge role={member.role} />
      </div>
    </div>
  );
}

export function ProjectMembers({ members }: ProjectMembersProps) {
  const sortedMembers = React.useMemo(() => {
    // Explicitly typed the keys to ProjectRole to fix indexing errors
    const roleOrder: Record<ProjectRole, number> = { 
      OWNER: 0, 
      ADMIN: 1, 
      MEMBER: 2, 
      VIEWER: 3 
    };

    return [...members].sort((a, b) => {
      const roleComparison = roleOrder[a.role] - roleOrder[b.role];
      if (roleComparison !== 0) return roleComparison;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [members]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-zinc-900 border border-white/5 text-zinc-400">
            <Users size={18} />
          </div>
          <div>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-100">
              Team_Protocol
            </h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tighter">
              {members.length} Active_{members.length === 1 ? "Node" : "Nodes"}
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {sortedMembers.map((member) => (
          <MemberItem key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}