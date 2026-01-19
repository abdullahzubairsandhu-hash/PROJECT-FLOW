// components/ui/textarea.tsx

import * as React from "react";
import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[120px] w-full rounded-xl border border-white/5 bg-zinc-900/50 px-4 py-3 text-[13px] font-medium text-zinc-100 transition-all duration-300",
          "placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:bg-zinc-900 focus-visible:border-white/10",
          "disabled:cursor-not-allowed disabled:opacity-30 custom-scrollbar resize-none",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";

export { Textarea };