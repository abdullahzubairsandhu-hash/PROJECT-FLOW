// components/tasks/global-task-button.tsx

"use client";

import { useState } from "react";
import { AddTaskModal } from "./add-task-modal";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
// Import your actual Project type to fix the 'any' and module errors
import type { Project } from "@/types/project"; 

interface GlobalTaskButtonProps {
  projects: Project[];
}

export function GlobalTaskButton({ projects }: GlobalTaskButtonProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        variant="default" 
        size="sm" 
        className="group shadow-none border border-white/10 bg-zinc-100 text-zinc-950 hover:bg-white"
      >
        <Plus className="mr-2 h-3 w-3 transition-transform group-hover:rotate-90" />
        Initialize New Task
      </Button>

      <AddTaskModal 
        open={open} 
        onOpenChange={setOpen} 
        // We map the projects to match the simplified shape the Modal expects
        projects={projects.map(p => ({ id: p.id, name: p.name }))} 
      />
    </>
  );
}