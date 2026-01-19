// components/tasks/bulk-task-actions.tsx

"use client";

import { Button } from "@/components/ui/button";
import type { TaskStatus, TaskPriority } from "@/types/task";
import { CheckCircle2, ArrowUpCircle, Trash2, X, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface BulkTaskActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
  onUpdateStatus: (status: TaskStatus) => void;
  onUpdatePriority: (priority: TaskPriority) => void;
  onDelete: () => void;
}

export function BulkTaskActions({
  selectedCount,
  onClearSelection,
  onUpdateStatus,
  onUpdatePriority,
  onDelete,
}: BulkTaskActionsProps) {
  // Using cn here to handle the entrance animation classes based on state
  const containerClasses = cn(
    "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
    "animate-in fade-in slide-in-from-bottom-4 duration-500",
    selectedCount === 0 && "hidden"
  );

  if (selectedCount === 0) return null;

  return (
    <div className={containerClasses}>
      <div className="flex items-center gap-6 px-6 py-3 border border-white/10 rounded-full bg-zinc-900/90 backdrop-blur-md shadow-2xl shadow-black/50">
        
        {/* Selection Count Indicator */}
        <div className="flex items-center gap-3 pr-6 border-r border-white/5">
          <Layers size={14} className="text-zinc-500" /> 
          <div className="flex h-5 w-5 items-center justify-center rounded-full bg-zinc-100 text-zinc-950 text-[10px] font-bold">
            {selectedCount}
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">
            Selected
          </span>
        </div>

        {/* Action Group */}
        <div className="flex items-center gap-1">
          <Button 
            size="sm" 
            variant="ghost"
            onClick={() => onUpdateStatus("DONE")}
            className="h-8 px-3 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-500/10 gap-2 rounded-full transition-all"
          >
            <CheckCircle2 size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Complete</span>
          </Button>

          <Button
            size="sm"
            variant="ghost"
            onClick={() => onUpdatePriority("HIGH")}
            className="h-8 px-3 text-zinc-400 hover:text-amber-400 hover:bg-amber-500/10 gap-2 rounded-full transition-all"
          >
            <ArrowUpCircle size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Priority</span>
          </Button>

          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onDelete}
            className="h-8 px-3 text-zinc-400 hover:text-red-400 hover:bg-red-500/10 gap-2 rounded-full transition-all"
          >
            <Trash2 size={14} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Delete</span>
          </Button>
        </div>

        {/* Dismiss Action */}
        <div className="pl-4 border-l border-white/5">
          <button 
            onClick={onClearSelection}
            className="p-1 rounded-full text-zinc-600 hover:text-zinc-100 transition-colors"
            title="Clear Selection"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}