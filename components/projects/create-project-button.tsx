// components/projects/create-project-button.tsx

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CreateProjectForm } from "./create-project-form";
import { Plus } from "lucide-react";

export function CreateProjectButton() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="group h-10 px-6 bg-zinc-100 text-zinc-950 hover:bg-white rounded-xl transition-all duration-300 shadow-[0_1px_20px_rgba(255,255,255,0.05)] active:scale-[0.98] border-none"
      >
        <span className="flex items-center gap-2.5">
          {/* Revolving Plus Icon */}
          <Plus 
            size={14} 
            strokeWidth={3} 
            className="text-zinc-950 transition-transform duration-500 group-hover:rotate-180" 
          />
          <span className="text-[11px] font-black uppercase tracking-[0.2em]">
            Initialize New Project
          </span>
        </span>
      </Button>
      <CreateProjectForm open={open} onOpenChange={setOpen} />
    </>
  );
}