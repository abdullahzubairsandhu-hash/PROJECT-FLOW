// comonents/tasks/global-task-filters.tsx

"use client";

import { cn } from "@/lib/utils";
import { TaskStatus } from "@/types/task";
import { ListFilter, CheckCircle2, Circle, Activity, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface GlobalTaskFiltersProps {
  currentStatus: TaskStatus | "ALL";
  onStatusChange: (status: TaskStatus | "ALL") => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  counts: Record<string, number>;
}

export function GlobalTaskFilters({ 
  currentStatus, 
  onStatusChange, 
  searchQuery, 
  onSearchChange, 
  counts 
}: GlobalTaskFiltersProps) {
  const filters = [
    { id: "ALL", label: "All_Manifest", icon: ListFilter, color: "text-zinc-400" },
    { id: "TODO", label: "Backlog", icon: Circle, color: "text-orange-500" },
    { id: "IN_PROGRESS", label: "Active", icon: Activity, color: "text-emerald-500" },
    { id: "DONE", label: "Completed", icon: CheckCircle2, color: "text-blue-500" },
  ];

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-10">
      {/* Status Toggles */}
      <div className="flex items-center gap-1.5 p-1 bg-zinc-900/50 border border-white/5 rounded-2xl w-fit">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = currentStatus === filter.id;
          const count = filter.id === "ALL" 
            ? Object.values(counts).reduce((a, b) => a + b, 0) 
            : counts[filter.id] || 0;

          return (
            <button
              key={filter.id}
              onClick={() => onStatusChange(filter.id as TaskStatus | "ALL")}
              className={cn(
                "flex items-center gap-2.5 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                isActive 
                  ? "bg-zinc-100 text-zinc-950 shadow-xl" 
                  : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
              )}
            >
              <Icon size={12} className={cn(!isActive && filter.color)} />
              {filter.label}
              <span className={cn("ml-1 opacity-50 font-mono")}>[{count}]</span>
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative w-full md:w-64 group">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 group-focus-within:text-emerald-500 transition-colors" />
        <Input
          placeholder="SEARCH_REGISTRY..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-9 bg-zinc-900/50 border-white/5 text-[10px] font-bold uppercase tracking-widest focus:ring-1 focus:ring-emerald-500/50 placeholder:text-zinc-700 rounded-xl"
        />
      </div>
    </div>
  );
}