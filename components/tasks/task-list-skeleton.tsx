// components/tasks/task-list-skeleton.tsx

"use client";

import * as React from "react";
import { cn } from "@/lib/utils"; // Now actively used below

interface TaskLoadingSkeletonProps {
  className?: string;
  index?: number;
}

export function TaskLoadingSkeleton({ className, index = 0 }: TaskLoadingSkeletonProps) {
  return (
    <div 
      className={cn(
        "relative flex flex-col rounded-xl border border-white/5 bg-zinc-900/20 p-4 space-y-5 overflow-hidden",
        "animate-in fade-in duration-500",
        className
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Shimmer Effect - using cn for layer management */}
      <div className={cn(
        "absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent",
        "animate-[shimmer_2s_infinite]"
      )} />

      <div className="space-y-3">
        {/* Title Line */}
        <div className={cn("h-4 rounded bg-zinc-800/80", "w-3/4")} />
        {/* Description Line */}
        <div className={cn("h-3 rounded bg-zinc-800/40", "w-1/2")} />
      </div>

      {/* Footer Metadata */}
      <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
        <div className="flex items-center gap-2">
          {/* Priority & Status Skeletons */}
          <div className="h-3 w-12 rounded bg-zinc-800/60" />
          <div className="h-5 w-16 rounded-md bg-zinc-800/40" />
        </div>

        <div className="flex items-center gap-3">
          {/* Date & Avatar Skeletons */}
          <div className="h-3 w-14 rounded bg-zinc-800/40" />
          <div className={cn(
            "h-6 w-6 rounded-full bg-zinc-800/80 border border-white/10",
            "shadow-inner"
          )} />
        </div>
      </div>
    </div>
  );
}

export function TaskListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <TaskLoadingSkeleton key={i} index={i} />
      ))}
    </div>
  );
}