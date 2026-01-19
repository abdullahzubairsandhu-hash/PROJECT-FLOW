// components/projects/add-resource-modal-wrapper

"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddResourceModal } from "./add-resource-modal";

export function AddResourceModalWrapper() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Button 
        onClick={() => setOpen(true)}
        className="bg-zinc-100 text-zinc-950 hover:bg-white rounded-xl px-6 font-black text-[10px] uppercase tracking-widest transition-all"
      >
        <Plus size={14} className="mr-2 stroke-[3px]" />
        Register_Asset
      </Button>
      
      <AddResourceModal open={open} onOpenChange={setOpen} />
    </>
  );
}