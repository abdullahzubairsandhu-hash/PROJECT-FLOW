// components/notifications/notification-feed.tsx

"use client";

import * as React from "react";
import { Bell, ShieldAlert } from "lucide-react";
import { NotificationItem } from "./notification-item";
import { cn } from "@/lib/utils";
import type { Notification } from "@prisma/client"; // Added strict type

interface NotificationFeedProps {
  initialNotifications: Notification[];
}

export function NotificationFeed({ initialNotifications }: NotificationFeedProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const unreadCount = initialNotifications?.length ?? 0;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg border border-white/5 bg-zinc-900/50 hover:bg-zinc-800 transition-all"
      >
        <Bell size={18} className={cn(
          "transition-colors",
          unreadCount > 0 ? "text-emerald-500 animate-pulse" : "text-zinc-500"
        )} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-20"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 mt-3 w-80 bg-zinc-950 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
            <div className="p-4 border-b border-white/10 bg-zinc-900/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldAlert size={12} className="text-emerald-500" />
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-100">
                  System_Activity_Log
                </h3>
              </div>
              <span className="text-[9px] font-mono text-zinc-500 italic">
                {unreadCount} Active_Signals
              </span>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto scrollbar-hide">
              {initialNotifications.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-2">
                  <p className="text-[10px] text-zinc-600 uppercase font-bold tracking-widest">All_Clear</p>
                </div>
              ) : (
                initialNotifications.map((n) => (
                  <NotificationItem key={n.id} notification={n} />
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}