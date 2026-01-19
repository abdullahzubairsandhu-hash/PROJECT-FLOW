// components/ui/dialog.tsx

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react"; // Added for a clean exit action

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    if (open) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop: Cinematic deep blur */}
      <div
        className="fixed inset-0 bg-zinc-950/40 backdrop-blur-md animate-in fade-in duration-500"
        onClick={() => onOpenChange(false)}
      />
      {/* Container logic for the DialogContent */}
      <div className="relative z-[101] w-full max-w-lg animate-in zoom-in-95 fade-in duration-300 ease-out">
        {children}
      </div>
    </div>
  );
}

export function DialogContent({
  children,
  className,
  onClose, // Added optional onClose for the X button
}: {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/90 shadow-2xl backdrop-blur-2xl p-8",
        className
      )}
    >
      {onClose && (
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-zinc-500 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      )}
      {children}
    </div>
  );
}

export function DialogHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn("flex flex-col space-y-2 text-left mb-6", className)}>{children}</div>;
}

export function DialogTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2 className={cn(
      "text-sm font-black uppercase tracking-[0.3em] text-zinc-100 italic", 
      className
    )}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn(
      "text-[11px] font-medium text-zinc-500 leading-relaxed max-w-[90%]", 
      className
    )}>
      {children}
    </p>
  );
}