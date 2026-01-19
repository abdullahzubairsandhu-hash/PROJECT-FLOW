// app/projects/[projectId]/loading.tsx (CREATE NEW FILE)

import { TaskListLoading } from "@/components/tasks/task-list-loading";

export default function ProjectPageLoading() {
  return (
    <div className="flex flex-col space-y-10 py-6 animate-in fade-in duration-500">
      {/* Header Skeleton: Matching Task_Manifest Style */}
      <div className="flex flex-col space-y-4 border-b border-white/5 pb-8">
        <div className="flex items-center gap-3">
          {/* Badge Skeleton */}
          <div className="h-5 w-24 bg-zinc-900 border border-white/5 animate-pulse" />
          <div className="h-[1px] w-8 bg-white/5" />
          {/* Status Skeleton */}
          <div className="h-3 w-16 bg-zinc-900 animate-pulse" />
        </div>
        
        {/* Title Skeleton */}
        <div className="h-10 w-2/3 bg-zinc-900 rounded-lg animate-pulse" />
      </div>

      {/* Content Layout Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-12">
          {/* Description Skeleton */}
          <div className="space-y-3">
            <div className="h-3 w-32 bg-zinc-900/50 animate-pulse" />
            <div className="h-4 w-full bg-zinc-900/50 animate-pulse" />
            <div className="h-4 w-5/6 bg-zinc-900/50 animate-pulse" />
          </div>

          {/* Task List Placeholder */}
          <div className="pt-8 border-t border-white/5">
            <div className="h-3 w-40 bg-zinc-900/50 animate-pulse mb-8" />
            <TaskListLoading />
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <aside className="lg:col-span-4 hidden lg:block">
          <div className="rounded-xl border border-white/5 bg-zinc-900/20 p-6 space-y-8">
            <div className="space-y-4">
              <div className="h-2 w-24 bg-zinc-900 animate-pulse" />
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-zinc-900 animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-20 bg-zinc-900 animate-pulse" />
                  <div className="h-2 w-16 bg-zinc-900 animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}