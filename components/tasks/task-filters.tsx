// components/tasks/task-filters.tsx

"use client";

import * as React from "react";
import { Filter, SortAsc, RotateCcw, Activity, SignalHigh } from "lucide-react";
import { cn } from "@/lib/utils";
import type {
  TaskStatusFilter,
  TaskPriorityFilter,
  TaskSortBy,
  TaskFilterOptions,
} from "@/lib/tasks/task-filters";

interface TaskFiltersProps {
  filters: TaskFilterOptions;
  onFiltersChange: (filters: TaskFilterOptions) => void;
}

export function TaskFilters({ filters, onFiltersChange }: TaskFiltersProps) {
  const isDirty = 
    filters.status !== "ALL" || 
    filters.priority !== "ALL" || 
    filters.sortBy !== "created-desc";

  // Standardizing the input aesthetic
  const selectClasses = cn(
    "w-full h-9 bg-zinc-900/50 border border-white/5 rounded-lg px-3 text-[11px] font-medium text-zinc-300",
    "focus:outline-none focus:border-white/20 transition-all appearance-none cursor-pointer hover:bg-zinc-800/50"
  );

  const labelClasses = "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1";

  return (
    <div className="flex flex-wrap items-center gap-6 p-1 mb-10 animate-in fade-in slide-in-from-top-1 duration-500">
      {/* Section Global Indicator - Now using the Filter Icon */}
      <div className="hidden lg:flex items-center justify-center h-9 w-9 rounded-lg border border-white/5 bg-zinc-900/30 text-zinc-600">
        <Filter size={14} strokeWidth={2.5} />
      </div>

      {/* Status Filter */}
      <div className="flex-1 min-w-[160px]">
        <label className={labelClasses}>
          <Activity size={10} /> Status
        </label>
        <select
          value={filters.status}
          onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as TaskStatusFilter })}
          className={selectClasses}
        >
          <option value="ALL">All Entries</option>
          <option value="TODO">Backlog</option>
          <option value="IN_PROGRESS">Active</option>
          <option value="DONE">Complete</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div className="flex-1 min-w-[160px]">
        <label className={labelClasses}>
          <SignalHigh size={10} /> Priority
        </label>
        <select
          value={filters.priority}
          onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value as TaskPriorityFilter })}
          className={selectClasses}
        >
          <option value="ALL">All Levels</option>
          <option value="HIGH">High Priority</option>
          <option value="MEDIUM">Medium</option>
          <option value="LOW">Low</option>
        </select>
      </div>

      {/* Sort Filter */}
      <div className="flex-1 min-w-[160px]">
        <label className={labelClasses}>
          <SortAsc size={10} /> Sequence
        </label>
        <select
          value={filters.sortBy}
          onChange={(e) => onFiltersChange({ ...filters, sortBy: e.target.value as TaskSortBy })}
          className={selectClasses}
        >
          <option value="created-desc">Newest First</option>
          <option value="created-asc">Oldest First</option>
          <option value="priority">Priority Rank</option>
          <option value="status">Process State</option>
        </select>
      </div>

      {/* Reset Action */}
      <div className={cn(
        "flex items-end self-end h-9 transition-all duration-500",
        isDirty ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none"
      )}>
        <button
          onClick={() =>
            onFiltersChange({
              status: "ALL",
              priority: "ALL",
              sortBy: "created-desc",
            })
          }
          className="flex items-center gap-2 px-4 h-full text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors group"
        >
          <RotateCcw size={12} className="group-hover:rotate-[-180deg] transition-transform duration-500" />
          Reset
        </button>
      </div>
    </div>
  );
}