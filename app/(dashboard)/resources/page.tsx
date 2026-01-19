// app/(dashboard)/resources/page.tsx

import * as React from "react";
import { prisma } from "@/lib/prisma";
import { ResourceCard } from "@/components/projects/resource-card";
import { AddResourceModalWrapper } from "@/components/projects/add-resource-modal-wrapper";
import { Box } from "lucide-react";

export default async function ResourcesPage() {
  // Fetch resources from database - strict typing and no unused variables
  const resources = await prisma.resource.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Box size={16} className="text-blue-500" />
            <h1 className="text-xs font-black uppercase tracking-[0.4em] text-zinc-100 font-mono">
              System_Vault_Registry
            </h1>
          </div>
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
            Centralized_Asset_Control_Protocol
          </p>
        </div>

        <div className="flex items-center gap-3">
          <AddResourceModalWrapper />
        </div>
      </div>

      {/* Stats / Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-y border-white/[0.03] py-6">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Total_Assets</span>
          <span className="text-xl font-mono font-black text-zinc-100">{resources.length}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mb-1">Registry_Status</span>
          <span className="text-xl font-mono font-black text-emerald-500 uppercase tracking-tighter">Active</span>
        </div>
      </div>

      {/* Grid Mapping */}
      {resources.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resources.map((item) => (
            <ResourceCard key={item.id} resource={item} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 border border-dashed border-white/5 rounded-3xl bg-zinc-900/10">
          <Box size={40} className="text-zinc-800 mb-4 stroke-[1px]" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 font-mono">
            No_Data_Assets_Synchronized
          </p>
        </div>
      )}
    </div>
  );
}