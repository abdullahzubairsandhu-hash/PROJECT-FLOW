// app/(dashboard)/settings/page.tsx

import * as React from "react";
import { Settings } from "lucide-react"; // Only keeping what we use
import { requireUser } from "@/lib/auth/require-user";
import { prisma } from "@/lib/prisma";
import { SettingsForm } from "@/components/settings/settings-form";

export default async function SettingsPage() {
  const user = await requireUser();
  
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  if (!dbUser) return null;

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">
          <Settings size={12} fill="currentColor" />
          System_Configuration
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-zinc-100 italic uppercase">
          Control_Center
        </h1>
        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest">
          Node_Status: Online // Master_Registry
        </p>
      </div>

      <SettingsForm user={dbUser} />
    </div>
  );
}