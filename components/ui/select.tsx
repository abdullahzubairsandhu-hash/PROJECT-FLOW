"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div className="relative group">
        <select
          ref={ref}
          className={cn(
            "flex h-10 w-full rounded-lg border border-white/5 bg-zinc-900/50 px-3 py-2 text-[13px] font-medium text-zinc-100 transition-all duration-300 appearance-none cursor-pointer",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:bg-zinc-900 focus-visible:border-white/10",
            "disabled:cursor-not-allowed disabled:opacity-30",
            className
          )}
          {...props}
        >
          {children}
        </select>
        
        {/* Custom Chevron Indicator - Native selects hide the default arrow easily */}
        <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
          <svg 
            width="10" 
            height="6" 
            viewBox="0 0 10 6" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-zinc-500 transition-colors group-hover:text-zinc-300"
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    );
  }
);

Select.displayName = "Select";

export { Select };