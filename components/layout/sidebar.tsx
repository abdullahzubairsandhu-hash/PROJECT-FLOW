// components/layout/sidebar.tsx

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Layers,
  Cpu,
  ShieldCheck
} from "lucide-react";
import { DASHBOARD_NAV_LINKS } from "@/config/navigation";

// FIXED: Interface now matches the props being passed by AppShell
interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const pathname = usePathname();

  // Helper to close sidebar on mobile navigation
  const handleClose = () => setIsOpen(false);

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-zinc-950/80 backdrop-blur-md lg:hidden animate-in fade-in duration-500"
          onClick={handleClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/[0.03] bg-zinc-950 transition-transform duration-500 ease-in-out lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Branding Module */}
          <div className="flex h-20 items-center px-6 mb-6 border-b border-white/[0.03]">
            <Link 
              href="/dashboard" 
              className="flex items-center gap-4 group"
              onClick={handleClose}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 transition-all group-hover:bg-white group-hover:rotate-3">
                <Layers size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className="text-[13px] font-black uppercase tracking-[0.3em] text-white leading-none">
                  ProjectFlow
                </span>
                <span className="text-[9px] font-bold text-emerald-500/80 mt-1 tracking-widest uppercase">
                  v 2.0
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-8 px-4">
            <div>
              <div className="px-3 mb-5 flex items-center gap-2">
                <Cpu size={12} className="text-zinc-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600">
                  Control Plane
                </span>
              </div>
              
              <div className="space-y-1.5">
                {/* FIXED: Using centralized config mapping */}
                {DASHBOARD_NAV_LINKS.map((link) => {
                  const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  const Icon = link.icon;
                  
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleClose}
                      className={cn(
                        "group relative flex items-center gap-4 rounded-xl px-4 py-3 text-[12px] font-bold uppercase tracking-wider transition-all duration-300",
                        isActive
                          ? "bg-white/[0.04] text-white border border-white/10 shadow-lg"
                          : "text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.02] border border-transparent"
                      )}
                    >
                      <Icon 
                        size={18} 
                        className={cn(
                          "transition-all duration-300",
                          isActive ? "text-white scale-110" : "text-zinc-700 group-hover:text-zinc-400"
                        )} 
                      />
                      <span>{link.label}</span>
                      
                      {isActive && (
                        <div className="ml-auto flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Infrastructure Footer */}
          <div className="mt-auto p-6 space-y-4">
            <div className="rounded-2xl bg-zinc-900/40 border border-white/5 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    System Core
                  </span>
                </div>
                <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase text-zinc-600">
                  <span>Latency</span>
                  <span className="text-zinc-400">12ms</span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-zinc-500" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-tighter">
                v2.0.4-stable
              </span>
              <span className="text-[10px] font-bold text-zinc-700 uppercase tracking-tighter">
                2026 © PF_LABS
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}