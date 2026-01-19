// components/members/member-sheet.tsx

"use client";

import * as React from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Shield, Zap, Target } from "lucide-react";

interface MemberSheetProps {
  member: {
    id: string;
    name: string;
    email: string;
    role: string;
    imageUrl?: string | null;
    totalTasks: number;
    completionRate: number;
  } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MemberSheet({ member, open, onOpenChange }: MemberSheetProps) {
  if (!member) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-zinc-950 border-l border-white/10 p-0 overflow-hidden outline-none">
        <ScrollArea className="h-full">
          <div className="h-32 bg-gradient-to-br from-emerald-500/20 to-blue-500/20 border-b border-white/5" />
          
          <div className="px-6 pb-10 -mt-12">
            <Avatar className="h-24 w-24 border-4 border-zinc-950 shadow-2xl rounded-2xl">
              <AvatarImage src={member.imageUrl || undefined} />
              <AvatarFallback className="bg-zinc-900 text-xl font-black">
                {member.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="mt-4 space-y-1">
              <SheetTitle className="text-xl font-black uppercase tracking-tighter text-zinc-100 italic">
                {member.name}
              </SheetTitle>
              <div className="flex items-center gap-2 text-zinc-500">
                <Mail size={12} />
                <span className="text-[11px] font-mono lowercase">{member.email}</span>
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <Badge variant="outline" className="bg-emerald-500/5 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                <Shield size={10} className="mr-1" /> {member.role}
              </Badge>
              <Badge variant="outline" className="bg-blue-500/5 text-blue-500 border-blue-500/20 text-[9px] font-black uppercase tracking-widest">
                <Zap size={10} className="mr-1" /> Active_Node
              </Badge>
            </div>

            <hr className="my-8 border-white/5" />

            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-4 flex items-center gap-2">
                  <Target size={12} className="text-zinc-100" /> Operational_Brief
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Assigned_Tasks</p>
                    <p className="text-xl font-black text-zinc-100 font-mono">{member.totalTasks}</p>
                  </div>
                  <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
                    <p className="text-[9px] font-bold text-zinc-500 uppercase mb-1">Completion_Rate</p>
                    <p className="text-xl font-black text-emerald-500 font-mono">{member.completionRate}%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}