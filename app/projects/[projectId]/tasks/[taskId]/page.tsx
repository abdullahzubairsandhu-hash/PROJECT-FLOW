// app/projects/[projectId]/tasks/[taskId]/page.tsx

import { notFound } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getTaskComments } from "@/lib/tasks/task-comment-queries";
import { TaskComments } from "@/components/tasks/task-comments";
import { prisma } from "@/lib/prisma";
import { requireTaskViewPermission } from "@/lib/tasks/task-authorization";
import { Calendar, User as UserIcon } from "lucide-react";
import { ExecutionChecklist } from "@/components/tasks/task-checklist"; // Naming is now consistent
// import { cn } from "@/lib/utils";

export default async function TaskPage({
  params,
}: {
  params: Promise<{ projectId: string; taskId: string }>;
}) {
  // ✅ UNWRAP PARAMS
  const { projectId, taskId } = await params;

  const user = await getCurrentUser();
  if (!user) return null;

  const task = await prisma.task.findUnique({
    where: { id: taskId },
    include: {
      creator: true,
      assignee: true,
      executionItems: true,
    },
  });

  if (!task  || task.projectId !== projectId) {
    notFound();
  }

  const userRole = await requireTaskViewPermission(projectId, user.id);
  const comments = await getTaskComments(taskId, user.id);


  // Helper to format the name from the Prisma User type
  const getDisplayName = (u: typeof task.assignee) => {
    if (!u) return "Unassigned";
    if (!u.firstName && !u.lastName) return u.email.split('@')[0];
    return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  };

  return (
    <div className="flex flex-col space-y-10 py-6 animate-in fade-in duration-700">
      {/* 1. Header Area: Task Identifier */}
      <div className="flex flex-col space-y-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-3">
          {/* Replaced missing Badge with a localized UI element */}
          <div className="inline-flex items-center px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/5 text-emerald-500 text-[10px] font-black uppercase tracking-widest">
            Task_ID: {task.id.slice(-6).toUpperCase()}
          </div>
          <div className="h-[1px] w-8 bg-white/10" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
            {task.status || "In_Progress"}
          </span>
        </div>
        
        <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-100 max-w-4xl italic">
          {task.title}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          <section className="space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Project_Brief</h3>
            <p className="text-[14px] leading-relaxed text-zinc-400 font-medium max-w-2xl">
              {task.description || "System Note: No detailed description provided for this objective."}
            </p>
          </section>

          <ExecutionChecklist 
          taskId={task.id} 
          initialItems={task.executionItems} 
          />

          <TaskComments 
              taskId={task.id} 
              projectId={projectId} 
              initialComments={comments} 
              currentUserId={user.id}
              currentUserRole={userRole}
            />

        </div>

        <aside className="lg:col-span-4 space-y-8">
          <div className="rounded-xl border border-white/5 bg-zinc-900/30 p-6 space-y-6">
            <div>
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-3">Personnel_Assigned</h4>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center">
                  <UserIcon className="h-4 w-4 text-zinc-400" />
                </div>
                <div>
                  {/* Fixed the name error by using the helper function */}
                  <p className="text-xs font-bold text-zinc-200">
                    {getDisplayName(task.assignee)}
                  </p>
                  <p className="text-[10px] text-zinc-500">Node Operator</p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5">
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-3">Chronology</h4>
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  Created {new Date(task.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="pt-6 border-t border-white/5">
              <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-3">System_Deadline</h4>
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar className="h-3.5 w-3.5 text-emerald-500" />
                <span className="text-[11px] font-medium uppercase tracking-wider">
                  {task.dueDate 
                    ? `Execute By: ${new Date(task.dueDate).toLocaleDateString()}` 
                    : "No Deadline Set"}
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}