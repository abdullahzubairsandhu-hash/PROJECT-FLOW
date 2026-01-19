// components/projects/project-header.tsx

import { CreateProjectButton } from "./create-project-button";

export function ProjectHeader() {
  return (
    <div className="relative flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-8 border-b border-white/5 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="flex flex-col space-y-4">
        {/* 1. System Status Label */}
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            Global Environment Registry
          </span>
        </div>

        {/* 2. Main Title: Project Manifest */}
        <div className="space-y-1">
          <h1 className="text-4xl font-black uppercase tracking-tight text-zinc-100 italic">
            Project_Manifest
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-zinc-500 leading-relaxed">
            Centralized workspace for tactical coordination and environment management.
          </p>
        </div>
      </div>

      {/* 3. Action Area */}
      <div className="flex items-center gap-3">
        <div className="group">
          <CreateProjectButton />
          {/* Note: Ensure the button inside CreateProjectButton 
              is labeled "Initialize_New_Project" to complete the look */}
        </div>
      </div>
    </div>
  );
}