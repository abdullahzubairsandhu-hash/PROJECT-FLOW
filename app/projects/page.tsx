// app/projects/page.tsx

import { getUserProjects } from "@/lib/projects/project-queries";
import { ProjectHeader } from "@/components/projects/project-header";
import { ProjectCard } from "@/components/projects/project-card";
import { requireUser } from "@/lib/auth/require-user";

export default async function ProjectsPage() {
  const user = await requireUser();
  const projects = await getUserProjects(user.id);

  return (
    <div className="flex flex-col space-y-10 py-6 animate-in fade-in duration-700">
      {/* 1. Header Area: Standardized across the Project stack */}
      <ProjectHeader />

      {/* 2. Content Area */}
      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/5 rounded-2xl bg-zinc-900/10">
          <div className="h-2 w-2 rounded-full bg-zinc-800 animate-pulse mb-4" />
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Registry_Empty
          </h3>
          <p className="text-[11px] text-zinc-600 uppercase tracking-widest mt-1">
            No active project clusters detected.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {projects.map((project, index) => (
            <div 
              key={project.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 