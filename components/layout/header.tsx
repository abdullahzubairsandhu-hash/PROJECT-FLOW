// components/layout/header.tsx

"use client";

import * as React from "react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Menu, LayoutGrid } from "lucide-react"; 
import { cn } from "@/lib/utils";
import type { Notification } from "@prisma/client";
import type { AuthUser } from "@/types/auth-user";
import { NotificationFeed } from "@/components/notifications/notification-feed";
import { GlobalSearch } from "@/components/dashboard/global-search"; // Integrated Search Component

interface HeaderProps {
  user: AuthUser;
  onMenuClick: () => void;
  notifications: Notification[];
}

export function Header({ user, onMenuClick, notifications }: HeaderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
    });
    
    return () => cancelAnimationFrame(handle);
  }, []);

  return (
    <header className={cn(
      "sticky top-0 z-40 h-20 w-full flex items-center justify-between px-6 lg:px-12",
      "border-b border-white/[0.03] bg-zinc-950/80 backdrop-blur-2xl"
    )}>
      {/* Left Section: Branding & Menu */}
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-10 w-10 text-zinc-400 hover:text-white hover:bg-white/5"
          onClick={onMenuClick}
        >
          <Menu size={20} />
        </Button>

        <div className="flex items-center gap-3 group cursor-default">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 group-hover:border-emerald-500/40 transition-all duration-500">
            <LayoutGrid className="w-5 h-5 text-emerald-500 fill-emerald-500/10" strokeWidth={2.5} />
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-[12px] font-black uppercase tracking-[0.3em] text-white leading-none">
              Project_Flow
            </span>
            <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest mt-1">
              Command_Center v2.0
            </span>
          </div>
        </div>
      </div>

      {/* Center Section: Global Command Trigger (Integrated Search) */}
      <div className="hidden md:flex flex-1 max-w-lg mx-12">
        <GlobalSearch />
      </div>

      {/* Right Section: Intel & Inset Profile */}
      <div className="flex items-center gap-4">
        <NotificationFeed initialNotifications={notifications} />

        <div className="h-6 w-[1px] bg-white/5 mx-2" />

        <div className="flex items-center gap-4 group">
          <div className="hidden xl:flex flex-col text-right">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-200 leading-none">
              {user.name || "Operator"}
            </span>
            <span className="text-[8px] font-bold text-emerald-500/60 uppercase tracking-[0.2em] mt-1">
              Verified_Session
            </span>
          </div>

          <div className="relative flex items-center justify-center">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-9 h-9 rounded-xl border-2 border-white/10 group-hover:border-emerald-500/50 transition-all duration-500 shadow-xl",
                  userButtonTrigger: "focus:ring-0 shadow-none outline-none",
                  userButtonPopoverCard: "bg-zinc-950 border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,1)]",
                  userButtonPopoverActionButton: "hover:bg-emerald-500/10 transition-colors py-3 px-4",
                  userButtonPopoverActionButtonText: "text-zinc-100 font-bold text-[11px] uppercase tracking-wider !opacity-100",
                  userButtonPopoverActionButtonIcon: "text-emerald-500",
                  userPreviewMainIdentifier: "text-white font-black uppercase tracking-tight",
                  userPreviewSecondaryIdentifier: "text-zinc-400 font-medium",
                  userButtonPopoverFooter: "hidden", 
                },
              }}
            />
            {mounted && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-zinc-950 rounded-full flex items-center justify-center">
                 <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}