// components/tasks/empty-task-state.tsx (UPDATED)

"use client";

import * as React from "react";
import { ClipboardList } from "lucide-react";

export function EmptyTaskState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 animate-in fade-in slide-in-from-bottom-2 duration-1000">
      <div className="relative flex flex-col items-center text-center max-w-sm">
        {/* Architectural Icon Container */}
        <div className="relative mb-8">
          <div className="absolute inset-0 rounded-full bg-zinc-800/20 blur-2xl animate-pulse" />
          <div className="relative h-20 w-20 flex items-center justify-center rounded-2xl border border-white/5 bg-zinc-900/50 backdrop-blur-sm shadow-2xl">
            <ClipboardList 
              size={32} 
              strokeWidth={1} 
              className="text-zinc-500 transition-colors duration-500 group-hover:text-zinc-200" 
            />
          </div>
          {/* Decorative Corner Accents */}
          <div className="absolute -top-1 -right-1 h-3 w-3 border-t border-r border-zinc-700" />
          <div className="absolute -bottom-1 -left-1 h-3 w-3 border-b border-l border-zinc-700" />
        </div>

        <div className="space-y-3">
          <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">
            System Protocol: Idle
          </h3>
          <p className="text-xl font-medium tracking-tight text-zinc-200">
            No active tasks found
          </p>
          <p className="text-sm text-zinc-500 leading-relaxed font-light">
            Your workspace is currently clear. Initialize your project by creating a new task entry to begin tracking.
          </p>
        </div>
      </div>
    </div>
  );
}