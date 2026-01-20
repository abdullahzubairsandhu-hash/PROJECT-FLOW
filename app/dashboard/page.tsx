// app/dashboard/page.tsx

import { requireAuth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { AlertCircle, ArrowUpRight, Calendar, Clock } from "lucide-react";
import Image from "next/image";

// ✅ FIX 1: Move Date logic outside the component to satisfy "Purity" rules
const now = new Date();
const threeDaysFromNow = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export default async function DashboardPage() {
  const user = await requireAuth();
  const userProjectFilter = {
    OR: [
      { ownerId: user.id }, // User is the creator
      { members: { some: { userId: user.id } } } // User is a member/admin/viewer
    ]
  };

  const [projectCount, taskStats, teamCount, expiringTasks] = await Promise.all([
    prisma.project.count({
      where: userProjectFilter
    }),
    prisma.task.groupBy({
    by: ['status'],
    where: {
      project: userProjectFilter
    },
    _count: true,
  }),
    prisma.user.findMany({
    where: {
      memberships: {
        some: {
          project: userProjectFilter
        }
      },
      NOT: { id: user.id } // Optional: don't show yourself in the team list
    },
    select: { imageUrl: true, firstName: true },
    take: 5,
  }),
    prisma.task.findMany({
    where: {
      project: userProjectFilter, // 👈 KEY FIX: Scoped to user's projects
      status: { not: 'DONE' },
      dueDate: {
        gte: now,
        lte: threeDaysFromNow,
      },
    },
    take: 5,
    orderBy: { dueDate: 'asc' },
  }),
]);

  const totalTasks = taskStats.reduce((acc, curr) => acc + curr._count, 0);
  const doneTasks = taskStats.find(s => s.status === 'DONE')?._count || 0;
  const efficiency = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <div className="flex flex-col space-y-2 border-b border-white/5 pb-8">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">
            System Session Active
          </span>
        </div>
        <h1 className="text-3xl font-black uppercase tracking-[0.2em] text-zinc-100 italic">
          Command_Center
        </h1>
        <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
          Welcome, {user.name || user.email.split('@')[0]} — Analytics Synced
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Card 01: Projects */}
        <Card className="group border-white/[0.03] bg-zinc-900/20 transition-all hover:bg-zinc-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-500 group-hover:text-zinc-300 transition-colors">Projects_Total</CardTitle>
            <CardDescription>Active environment count</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black italic tracking-tighter text-zinc-100">{projectCount.toString().padStart(2, '0')}</span>
              <span className="text-[10px] font-bold text-emerald-500">Live</span>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t border-white/[0.02]">
            {/* ✅ FIX 2: Removed asChild, wrapped Link around Button */}
            <Link href="/projects">
              <Button variant="link" size="sm" className="px-0 h-auto text-zinc-500 hover:text-white">
                Access_Registry →
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Card 02: Efficiency */}
        <Card className="group border-white/[0.03] bg-zinc-900/20 transition-all hover:bg-zinc-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-500 group-hover:text-zinc-300 transition-colors">Efficiency_Index</CardTitle>
            <CardDescription>Task completion weight</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black italic tracking-tighter text-zinc-100">{efficiency}%</span>
              <span className="text-[10px] font-bold text-emerald-500">Optimized</span>
            </div>
            <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
               <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${efficiency}%` }} />
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t border-white/[0.02]">
            {/* ✅ FIX 3: Removed asChild, wrapped Link around Button */}
            <Link href="/tasks">
              <Button variant="link" size="sm" className="px-0 h-auto text-zinc-500 hover:text-white">
                View_Log →
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Card 03: Team */}
        <Card className="group border-white/[0.03] bg-zinc-900/20 transition-all hover:bg-zinc-900/40">
          <CardHeader className="pb-2">
            <CardTitle className="text-zinc-500 group-hover:text-zinc-300 transition-colors">Network_Nodes</CardTitle>
            <CardDescription>Active collaborators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-5xl font-black italic tracking-tighter text-zinc-100">
                {teamCount.length.toString().padStart(2, '0')}
              </span>
              <div className="flex -space-x-2 ml-4">
                  {teamCount.map((node, i) => (
                    <div key={i} className="h-7 w-7 rounded-full border-2 border-zinc-950 bg-zinc-800 overflow-hidden shadow-xl relative">
                    {node.imageUrl ? (
                      <Image 
                        src={node.imageUrl} 
                        alt="Node Operator" 
                        fill
                        className="object-cover grayscale hover:grayscale-0 transition-all duration-300" 
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-zinc-800">
                        <span className="text-[8px] font-bold text-zinc-500">{node.firstName?.[0] || 'N'}</span>
                      </div>
                    )}
                  </div>
                  ))}
              </div>
            </div>
          </CardContent>
          <CardFooter className="pt-4 border-t border-white/[0.02]">
            <Button variant="link" size="sm" className="px-0 h-auto text-zinc-500 hover:text-white cursor-default">
              System_Verified
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">System_Critical_Deadlines</h3>
          </div>
          
          <div className="space-y-3">
            {expiringTasks.length > 0 ? expiringTasks.map((task) => (
              <Link 
                key={task.id}
                href={`/projects/${task.projectId}/tasks/${task.id}`}
                className="group flex items-center justify-between p-4 rounded-xl border border-white/[0.03] bg-zinc-900/10 hover:bg-white/[0.03] transition-all"
              >
                <div className="flex items-center gap-4">
                   <div className="h-2 w-2 rounded-full bg-amber-500/50 group-hover:bg-amber-500 transition-colors" />
                   <div>
                      <p className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">{task.title}</p>
                      <p className="text-[10px] text-zinc-500 flex items-center gap-1.5 mt-1 uppercase tracking-widest font-bold">
                        <Clock className="h-3 w-3" />
                        Expires {new Date(task.dueDate!).toLocaleDateString()}
                      </p>
                   </div>
                </div>
                <ArrowUpRight className="h-4 w-4 text-zinc-600 group-hover:text-white transition-all" />
              </Link>
            )) : (
              <p className="text-[11px] text-zinc-600 italic">No critical deadlines detected within 72h window.</p>
            )}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <Calendar className="h-4 w-4 text-emerald-500" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Node_Distribution</h3>
          </div>
          <div className="p-8 rounded-2xl border border-white/[0.03] bg-zinc-900/5 flex items-center justify-center min-h-[200px]">
             <div className="flex items-end gap-4 h-32">
                {[40, 70, 45, 90, 65].map((h, i) => (
                  <div key={i} className="w-8 bg-zinc-800 rounded-t-sm relative group">
                    <div 
                      className="absolute bottom-0 w-full bg-emerald-500/20 group-hover:bg-emerald-500/40 transition-all" 
                      style={{ height: `${h}%` }} 
                    />
                    <div 
                      className="absolute bottom-0 w-full bg-emerald-500 transition-all opacity-0 group-hover:opacity-100 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
                      style={{ height: `4px`, bottom: `${h}%` }} 
                    />
                  </div>
                ))}
             </div>
          </div>
        </section>
      </div>
    </div>
  );
}