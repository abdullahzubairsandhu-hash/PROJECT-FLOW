// components/projects/project-role-badge.tsx

import { cn } from "@/lib/utils";
import type { ProjectRole } from "@/types/project-member";

interface ProjectRoleBadgeProps {
  role: ProjectRole;
  className?: string;
}

const roleConfig: Record<ProjectRole, { label: string; dotClass: string }> = {
  OWNER: {
    label: "SYSTEM OWNER",
    dotClass: "bg-amber-500 shadow-[0_0_5px_rgba(245,158,11,0.5)]",
  },
  ADMIN: {
    label: "ADMINISTRATOR",
    dotClass: "bg-zinc-100 shadow-[0_0_5px_rgba(255,255,255,0.3)]",
  },
  MEMBER: {
    label: "MEMBER",
    dotClass: "bg-zinc-500",
  },
  VIEWER: {
    label: "VIEW-ONLY",
    dotClass: "border border-zinc-600 bg-transparent",
  },
};

export function ProjectRoleBadge({ role, className }: ProjectRoleBadgeProps) {
  const config = roleConfig[role];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-md border border-white/5 bg-zinc-950 px-2 py-1 transition-all duration-300",
        className
      )}
    >
      {/* Precision Dot Indicator */}
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dotClass)} />
      
      {/* Technical Label */}
      <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-400">
        {config.label}
      </span>
    </span>
  );
}