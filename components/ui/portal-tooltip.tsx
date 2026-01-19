// components/ui/portal-tooltip.tsx

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/utils";

interface PortalTooltipProps {
  children: React.ReactNode;
  containerId?: string;
  anchorRect?: DOMRect | null;
  className?: string;
}

export function PortalTooltip({
  children,
  containerId,
  anchorRect,
  className,
}: PortalTooltipProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  const container = containerId
    ? document.getElementById(containerId)
    : document.body;

  if (!container) return null;

  // Precision positioning logic
  const style: React.CSSProperties = anchorRect
    ? {
        position: "absolute",
        // We add a small offset (8px) so the tooltip doesn't touch the trigger
        top: anchorRect.top + window.scrollY - 8,
        left: anchorRect.left + window.scrollX + anchorRect.width / 2,
        transform: "translate(-50%, -100%)", // Centers and flips it above the anchor
        zIndex: 100,
      }
    : {};

  return createPortal(
    <div 
      style={style} 
      className={cn(
        "pointer-events-none select-none",
        "animate-in fade-in zoom-in-95 duration-200",
        className
      )}
    >
      <div className={cn(
        "rounded-md border border-white/10 bg-zinc-900/95 px-2.5 py-1.5 shadow-2xl backdrop-blur-md",
        "text-[10px] font-black uppercase tracking-widest text-zinc-100"
      )}>
        {children}
      </div>
    </div>, 
    container
  );
}