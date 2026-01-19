// components/projects/project-card.tsx

"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ProjectActions } from "./project-actions";
import type { Project } from "@/types/project";
import { cn } from "@/lib/utils";
import { Calendar, CheckSquare, Folder } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ProjectCardProps {
  project: Project;
}

const statusConfig = {
  ACTIVE: {
    dot: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
    text: "text-emerald-500",
  },
  PLANNING: {
    dot: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]",
    text: "text-blue-500",
  },
  COMPLETED: {
    dot: "bg-zinc-500 shadow-[0_0_8px_rgba(113,113,122,0.4)]",
    text: "text-zinc-500",
  },
};

export function ProjectCard({ project }: ProjectCardProps) {
  const config = statusConfig[project.status];

  return (
    <Card className="group relative flex flex-col h-full border-white/5 bg-zinc-900/40 transition-all duration-300 hover:bg-zinc-900/60 hover:border-white/10 overflow-hidden">
      {/* Primary Navigation Layer */}
      <Link href={`/projects/${project.id}`} className="absolute inset-0 z-10" />
      
      <CardHeader className="relative space-y-4 pb-4">
        {/* Header Container: Title & Status */}
        <div className="flex items-start justify-between gap-4 w-full">
          
          {/* Left Side: Icon & Truncated Title */}
          <div className="flex items-center gap-3 min-w-0 relative z-30"> 
  <div className="p-2 rounded-md bg-zinc-800 border border-white/5 text-zinc-400 group-hover:text-zinc-100 transition-colors shrink-0">
    <Folder size={18} />
  </div>
  
  <TooltipProvider>
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <CardTitle className="text-lg font-semibold tracking-tight text-zinc-100 group-hover:text-white truncate cursor-help pointer-events-auto">
          {project.name}
        </CardTitle>
      </TooltipTrigger>
      <TooltipContent 
        side="top" 
        className="bg-zinc-950 border border-white/10 text-zinc-200 text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1.5 shadow-2xl z-[100]"
      >
        {project.name}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</div>
          
          {/* Right Side: Status Badge (Now Locked in place) */}
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-white/[0.03] border border-white/5 shrink-0">
            <div className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
            <span className={cn("text-[10px] font-bold uppercase tracking-wider", config.text)}>
              {project.status}
            </span>
          </div>
        </div>

        <CardDescription className="text-zinc-500 text-sm line-clamp-2 leading-relaxed min-h-[2.5rem]">
          {project.description || "No description provided"}
        </CardDescription>
      </CardHeader>

      <CardContent className="relative space-y-4 mt-auto">
        <div className="h-[1px] w-full bg-white/5" />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-zinc-300 transition-colors">
              <CheckSquare size={14} className="text-zinc-500" />
              <span className="text-xs font-medium">
                {project.taskCount} <span className="text-zinc-600">tasks</span>
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-zinc-400 group-hover:text-zinc-300 transition-colors">
              <Calendar size={14} className="text-zinc-500" />
              <span className="text-xs font-medium uppercase tracking-tighter">
                {new Date(project.createdAt).toLocaleDateString("en-US", { 
                  month: "short", 
                  day: "numeric"
                })}
              </span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="relative pt-2 pb-4 px-6 z-20">
        <ProjectActions projectId={project.id} projectStatus={project.status} />
      </CardFooter>
    </Card>
  );
}