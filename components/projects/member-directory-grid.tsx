//components/projects/member-directory-grid.tsx

"use client";

import * as React from "react";
import { Mail, Shield } from "lucide-react"; 
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MemberSheet } from "@/components/members/member-sheet";

interface Member {
  id: string;
  fullName: string;
  email: string;
  imageUrl: string | null;
  createdAt: Date;
  totalTasks: number;
  completionRate: number;
}

export function MemberDirectoryGrid({ users }: { users: Member[] }) {
  const [selectedMember, setSelectedMember] = React.useState<Member | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleOpenSheet = (user: Member) => {
    setSelectedMember(user);
    setOpen(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {users.map((member) => (
          <div 
            key={member.id} 
            onClick={() => handleOpenSheet(member)}
            className="group relative bg-zinc-900/40 border border-white/5 p-6 rounded-2xl hover:bg-zinc-900/60 hover:border-white/10 transition-all duration-500 cursor-pointer"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-14 w-14 rounded-xl border border-white/10">
                    {member.imageUrl && <AvatarImage src={member.imageUrl} alt={member.fullName} />}
                    <AvatarFallback className="bg-zinc-800 text-zinc-400 rounded-xl font-bold">
                      {member.fullName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-zinc-900" />
                </div>
                
                <div className="min-w-0">
                  <h3 className="text-zinc-100 font-black uppercase italic tracking-tight truncate leading-none mb-2">
                    {member.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-mono tracking-tighter">
                    <Mail size={10} className="text-zinc-700" />
                    {member.email}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center justify-between border-t border-white/[0.03] pt-4">
              <div className="flex items-center gap-2">
                <Shield size={12} className="text-emerald-500/50" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Tasks: {member.totalTasks}
                </span>
              </div>
              <span className="text-[9px] font-mono text-zinc-700 uppercase">
                Since_{new Date(member.createdAt).getFullYear()}
              </span>
            </div>
          </div>
        ))}
      </div>

      <MemberSheet 
        member={selectedMember ? {
          ...selectedMember,
          name: selectedMember.fullName,
          role: "SYSTEM_OPERATOR"
        } : null} 
        open={open} 
        onOpenChange={setOpen} 
      />
    </>
  );
}