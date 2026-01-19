// app/projects/loading.tsx


import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";

function SkeletonCard() {
  return (
    <Card className="relative overflow-hidden border-white/[0.03] bg-zinc-900/20">
      {/* Precision Scanning Line */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/20 animate-scan" />
      
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          {/* Title Skeleton */}
          <div className="h-5 w-3/4 bg-zinc-800 animate-pulse" />
          {/* Status Badge Skeleton */}
          <div className="h-4 w-12 bg-zinc-800 animate-pulse border border-white/5" />
        </div>
        
        {/* Description Lines */}
        <div className="space-y-2">
          <div className="h-2.5 w-full bg-zinc-800/60 animate-pulse" />
          <div className="h-2.5 w-4/6 bg-zinc-800/60 animate-pulse" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pt-0">
        <div className="h-[1px] w-full bg-white/5" />
        {/* Metadata Readout Skeletons */}
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 rounded-full bg-zinc-800 animate-pulse" />
          <div className="h-3 w-20 bg-zinc-800 animate-pulse" />
        </div>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="h-8 w-full bg-zinc-800/40 animate-pulse" />
      </CardFooter>
    </Card>
  );
}

export default function ProjectsLoading() {
  return (
    <div className="flex flex-col space-y-10 py-6 animate-in fade-in duration-500">
      {/* Index Header Skeleton */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-zinc-800 animate-pulse" />
          <div className="h-3 w-32 bg-zinc-800 animate-pulse tracking-widest" />
        </div>
        <div className="h-9 w-64 bg-zinc-800 rounded-sm animate-pulse" />
        <div className="h-3 w-96 bg-zinc-800/50 animate-pulse" />
      </div>

      {/* Grid Layout */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}