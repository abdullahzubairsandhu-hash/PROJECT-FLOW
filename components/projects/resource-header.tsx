// components/projects/resource-header.tsx

"use client";

import * as React from "react";
import { Box, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddResourceModal } from "./add-resource-modal";

export function ResourceHeader() {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-blue-500">
            <Box size={12} fill="currentColor" />
            Central_Vault_v1.0
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-100 italic uppercase">
            System_Resources
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={14} />
            <Input 
              placeholder="SEARCH_REGISTRY..." 
              className="pl-9 bg-zinc-900/40 border-white/5 text-[10px] font-mono w-64 h-10 rounded-xl focus:border-blue-500/50"
            />
          </div>
          <Button 
            onClick={() => setOpen(true)}
            className="bg-zinc-100 text-zinc-950 hover:bg-white rounded-xl font-black text-[10px] uppercase tracking-widest px-6 h-10 shadow-[0_0_20px_rgba(255,255,255,0.05)]"
          >
            <Plus size={14} className="mr-2" />
            Add_New_Asset
          </Button>
        </div>
      </div>

      <AddResourceModal open={open} onOpenChange={setOpen} />
    </>
  );
}