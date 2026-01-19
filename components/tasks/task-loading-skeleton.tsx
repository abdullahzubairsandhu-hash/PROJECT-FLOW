// components/tasks/task-loading-skeleton.tsx 

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TaskLoadingSkeletonProps {
  className?: string;
}

export function TaskLoadingSkeleton({ className }: TaskLoadingSkeletonProps) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-xl border border-white/5 bg-zinc-900/20 p-4 space-y-5 overflow-hidden",
        className
      )}
    >
      {/* Precision Shimmer Overlay */}
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/[0.02] to-transparent" />

      <div className="space-y-4">
        {/* Top Row: Title & Action Area */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-3.5 w-3/4 rounded bg-zinc-800/80 animate-pulse" />
            <div className="h-2.5 w-1/2 rounded bg-zinc-800/40 animate-pulse" />
          </div>
          <div className="h-4 w-4 rounded bg-zinc-800/20 animate-pulse" />
        </div>

        {/* Metadata Footer Skeleton */}
        <div className="flex items-center justify-between pt-4 border-t border-white/[0.03]">
          <div className="flex items-center gap-2">
            {/* Priority & Status Pills */}
            <div className="h-3 w-8 rounded bg-zinc-800/60 animate-pulse" />
            <div className="h-5 w-16 rounded-md bg-zinc-800/40 animate-pulse" />
          </div>

          <div className="flex items-center gap-3">
            {/* Date Skeleton */}
            <div className="h-3 w-12 rounded bg-zinc-800/30 animate-pulse" />
            {/* Avatar Skeleton */}
            <div className="h-5 w-5 rounded-full bg-zinc-800/80 border border-white/5 animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}