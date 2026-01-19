// components/notifications/notification-item.tsx

"use client";

import { Check, Clock } from "lucide-react";
import { markNotificationAsRead } from "@/lib/notifications/notification-mutations";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Notification } from "@prisma/client"; // Added strict type

export function NotificationItem({ notification }: { notification: Notification }) {
  const [isRemoving, setIsRemoving] = useState(false);
  const router = useRouter();

  const handleMarkRead = async () => {
    setIsRemoving(true);
    // Wait for animation to finish before calling DB
    setTimeout(async () => {
      await markNotificationAsRead(notification.id);
      router.refresh(); 
    }, 300);
  };

  return (
    <div className={cn(
      "group relative p-4 border-b border-white/5 bg-zinc-950/50 transition-all duration-300",
      isRemoving ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"
    )}>
      <div className="flex justify-between gap-4">
        <div className="space-y-1">
          <p className="text-[11px] font-medium text-zinc-200 leading-relaxed">
            {notification.message}
          </p>
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-500 uppercase">
            <Clock size={10} />
            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
        
        <button 
          onClick={handleMarkRead}
          className="h-6 w-6 shrink-0 rounded border border-white/10 flex items-center justify-center hover:bg-emerald-500/20 hover:border-emerald-500/50 transition-all"
        >
          <Check size={12} className="text-zinc-500 hover:text-emerald-500" />
        </button>
      </div>
      <div className="absolute left-0 top-0 h-full w-[2px] bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
    </div>
  );
}