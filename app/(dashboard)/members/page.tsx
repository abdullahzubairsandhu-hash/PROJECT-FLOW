// app/(dashboard)/members/page.tsx

import * as React from "react";
import { Zap } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";
import { MemberDirectoryGrid } from "@/components/projects/member-directory-grid";

export default async function MemberDirectoryPage() {
  await requireUser();
  
  const users = await prisma.user.findMany({
    orderBy: { firstName: 'asc' },
    include: {
      assignedTasks: {
        select: { status: true }
      }
    }
  });

  const formattedUsers = users.map(user => {
    const totalTasks = user.assignedTasks.length;
    const completedTasks = user.assignedTasks.filter(t => t.status === "DONE").length;
    
    // Calculate percentage, default to 0 if no tasks
    const completionRate = totalTasks > 0 
      ? Math.round((completedTasks / totalTasks) * 100) 
      : 0;

    return {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      // Dynamic calculated fields
      fullName: [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email.split('@')[0],
      totalTasks,
      completionRate
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">
          <Zap size={12} fill="currentColor" />
          Active_Directory
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-100 italic uppercase">
          Node_Network
        </h1>
        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
          Entities_Detected: {users.length.toString().padStart(3, '0')}
        </p>
      </div>

      <MemberDirectoryGrid users={formattedUsers} />
    </div>
  );
}