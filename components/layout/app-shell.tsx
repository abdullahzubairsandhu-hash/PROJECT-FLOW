// components/layout/app-shell.tsx

"use client";

import * as React from "react";
import { Header } from "./header"; 
import { Sidebar } from "./sidebar";
import type { AuthUser } from "@/types/auth-user";
import type { Notification } from "@prisma/client";

interface AppShellProps {
  children: React.ReactNode;
  user: AuthUser;
  notifications: Notification[];
}

export function AppShell({ children, user, notifications = [] }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-950 text-zinc-100 selection:bg-white/10">
      <Sidebar 
        isOpen={sidebarOpen} 
        setIsOpen={setSidebarOpen} 
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header 
          user={user} 
          onMenuClick={() => setSidebarOpen(!sidebarOpen)} 
          notifications={notifications} 
        />

        <main className="flex-1 overflow-y-auto bg-zinc-950 p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}