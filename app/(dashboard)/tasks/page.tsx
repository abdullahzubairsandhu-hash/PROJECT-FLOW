// app/(dashboard)/tasks/page.tsx

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserTasks } from "@/lib/tasks/task-queries";
import { getUserProjects } from "@/lib/projects/project-queries";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { GlobalTaskButton } from "@/components/tasks/global-task-button";
import { TaskManifestClient } from "@/components/tasks/task-manifest-client";

export default async function TasksPage() {
  const { userId: clerkId } = await auth(); 
  const user = await getCurrentUser();

  if (!clerkId || !user) redirect("/sign-in");

  const [tasks, projects] = await Promise.all([
    getUserTasks(user.id),
    getUserProjects(user.id)
  ]);

  return (
      <div className="flex flex-col space-y-8 animate-in fade-in duration-700">
        {/* HEADER SECTION */}
        <div className="flex items-end justify-between border-b border-white/5 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
                Operational Environment
              </span>
            </div>
            <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-zinc-100 italic">
              Task_Manifest
            </h1>
          </div>

          <GlobalTaskButton projects={projects} />
        </div>

        {/* CLIENT COMPONENT: 
            This now handles the Filters, Search, and the Task Sections automatically.
        */}
        <div className="pb-20">
          <TaskManifestClient initialTasks={tasks} />
        </div>
      </div>
  );
}