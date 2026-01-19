// app/projects/[projectId]/page.tsx 

import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth/require-user";
import { getProjectById } from "@/lib/projects/project-queries";
import { getProjectMembers } from "@/lib/projects/project-members";
import { canManageMembers } from "@/lib/projects/project-role";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProjectDetailsHeader } from "@/components/projects/project-details-header";
import { ProjectMembers } from "@/components/projects/project-members";
import { TasksSection } from "@/components/tasks/tasks-section";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  if (!projectId) notFound();

  const user = await requireUser();
  const project = await getProjectById(projectId, user.id);

  if (!project) notFound();

  const members = await getProjectMembers(projectId, user.id);
  const owner = await prisma.user.findUnique({
    where: { id: project.ownerId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
    },
  });

  if (!owner) notFound();

  const ownerName = owner.firstName || owner.email.split("@")[0];
  const userCanManageMembers = canManageMembers(project.currentUserRole);

  return (
    <div className="max-w-7xl mx-auto space-y-10 py-6 animate-in fade-in duration-700">
      {/* 1. Terminal Breadcrumb Navigation */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 px-2 text-zinc-500 hover:text-white hover:bg-white/5 transition-all group"
          >
            <ChevronLeft className="mr-1 h-3 w-3 transition-transform group-hover:-translate-x-1" />
            <span className="text-[10px] font-black uppercase tracking-widest">Back_to_Index</span>
          </Button>
        </Link>
        <div className="h-[1px] w-8 bg-white/5" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-700">
          NODE: {projectId.slice(-8).toUpperCase()}
        </span>
      </div>

      {/* 2. Primary Header Integration */}
      <ProjectDetailsHeader
        project={project}
        ownerName={ownerName}
        canManageMembers={userCanManageMembers}
      />

      {/* 3. Main Operational Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Task Control Center (Left/Center) */}
        <div className="lg:col-span-8 space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-1 w-1 rounded-full bg-emerald-500" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Active_Operations</h3>
            </div>
            <TasksSection
              projectId={projectId}
              userId={user.id}
              userRole={project.currentUserRole}
            />
          </div>
        </div>

        {/* System Intelligence Sidebar (Right) */}
        <aside className="lg:col-span-4 space-y-8">
          {/* Members Protocol Card */}
          <ProjectMembers members={members} />

          {/* Metadata Card */}
          <Card className="border-white/[0.03] bg-zinc-900/20 backdrop-blur-sm overflow-hidden group hover:bg-zinc-900/40 transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Project_Parameters</CardTitle>
                <Info className="h-3 w-3 text-zinc-600" />
              </div>
              <CardDescription className="text-[11px] font-medium text-zinc-500">
                Deployment: {new Date(project.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2 italic">Brief_Summary</h4>
                <p className="text-[13px] leading-relaxed text-zinc-400 font-medium">
                  {project.description || "System Note: No descriptive summary initialized for this cluster."}
                </p>
              </div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}