// components/dashboard/dashboard.tsx

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { 
  Briefcase, 
  CheckCircle2, 
  Clock, 
  ListTodo, 
  ArrowRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type RecentTask = {
  id: string;
  title: string;
  status: string;
  dueDate: string | null;
  project: {
    name: string;
  };
};

type DashboardData = {
  totalProjects: number;
  totalTasks: number;
  pendingTasks: number;
  completedTasks: number;
  recentTasks: RecentTask[];
};

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const [
      totalProjects,
      totalTasks,
      pendingTasks,
      completedTasks,
      recentTasksRaw,
    ] = await Promise.all([
      prisma.project.count(),
      prisma.task.count(),
      prisma.task.count({ where: { status: "TODO" } }),
      prisma.task.count({ where: { status: "DONE" } }),
      prisma.task.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          project: { select: { name: true } },
        },
      }),
    ]);

    const recentTasks = recentTasksRaw.map((task) => ({
      ...task,
      dueDate: task.dueDate ? task.dueDate.toISOString() : null,
    }));

    return {
      totalProjects,
      totalTasks,
      pendingTasks,
      completedTasks,
      recentTasks,
    };
  } catch (error) {
    console.error("Dashboard data fetch error:", error);
    return null;
  }
}

export default async function Dashboard() {
  const data = await getDashboardData();

  if (!data) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <Card className="w-full max-w-md border-white/5 bg-zinc-900/50 backdrop-blur-md">
          <CardContent className="pt-6">
            <p className="text-center text-zinc-400 text-sm">
              Unable to load dashboard data. Please try again later.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: "Projects",
      value: data.totalProjects,
      icon: Briefcase,
      description: "Active workspaces",
      color: "text-blue-400",
    },
    {
      title: "Total Tasks",
      value: data.totalTasks,
      icon: ListTodo,
      description: "Lifetime throughput",
      color: "text-zinc-100",
    },
    {
      title: "Pending",
      value: data.pendingTasks,
      icon: Clock,
      description: "Require attention",
      color: "text-amber-400",
    },
    {
      title: "Completed",
      value: data.completedTasks,
      icon: CheckCircle2,
      description: "Successfully closed",
      color: "text-emerald-400",
    },
  ];

  return (
    <div className="space-y-10 pb-10">
      {/* Dashboard header - Clean & Minimal */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100">
          Overview
        </h1>
        <p className="text-sm text-zinc-500 max-w-2xl">
          Real-time insights across your active projects and team performance.
        </p>
      </div>

      {/* Stats cards - Data-driven grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.title}
              className="border-white/5 bg-zinc-900/40 transition-colors hover:bg-zinc-900/60"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  {stat.title}
                </CardDescription>
                <Icon className={cn("h-4 w-4", stat.color)} strokeWidth={2.5} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold tracking-tight text-zinc-100">
                  {stat.value}
                </div>
                <p className="text-[11px] font-medium text-zinc-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Bottom Section: Recent Activity */}
      <div className="grid gap-6">
        <Card className="border-white/5 bg-zinc-900/40">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold text-zinc-100">Recent Activity</CardTitle>
              <CardDescription className="text-xs text-zinc-500">Latest 5 tasks updated in your workspace</CardDescription>
            </div>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-100 gap-2 text-xs">
                View All Tasks <ArrowRight size={14} />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="pt-6">
            {data.recentTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="h-10 w-10 rounded-full bg-zinc-800 flex items-center justify-center mb-4">
                  <ListTodo className="text-zinc-500" size={20} />
                </div>
                <p className="text-sm text-zinc-400">No recent activity found.</p>
              </div>
            ) : (
              <div className="space-y-0">
                {data.recentTasks.map((task: RecentTask, index) => (
                  <div
                    key={task.id}
                    className={cn(
                      "flex items-center justify-between py-4 group transition-all",
                      index !== data.recentTasks.length - 1 && "border-b border-white/5"
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "h-2 w-2 rounded-full",
                        task.status === "COMPLETED" ? "bg-emerald-500" : 
                        task.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-zinc-600"
                      )} />
                      <div>
                        <p className="text-sm font-medium text-zinc-200 group-hover:text-white transition-colors">
                          {task.title}
                        </p>
                        <p className="text-[11px] text-zinc-500 flex items-center gap-1 mt-0.5">
                          {task.project.name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                      {task.dueDate && (
                        <div className="hidden md:flex flex-col items-end">
                          <span className="text-[10px] uppercase font-bold text-zinc-600 tracking-wider">Due Date</span>
                          <span className="text-xs text-zinc-400">{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                      <Link href={`/projects/tasks/${task.id}`}>
                        <Button variant="secondary" size="icon" className="h-8 w-8 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-400">
                          <ExternalLink size={14} />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}