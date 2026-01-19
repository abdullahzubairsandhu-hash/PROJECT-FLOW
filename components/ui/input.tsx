import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-white/5 bg-zinc-900/50 px-3 py-2 text-[13px] font-medium text-zinc-100 transition-all duration-300",
          "file:border-0 file:bg-transparent file:text-[11px] file:font-black file:uppercase file:text-zinc-100",
          "placeholder:text-zinc-600 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 focus-visible:bg-zinc-900 focus-visible:border-white/10",
          "disabled:cursor-not-allowed disabled:opacity-30",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

const FormControl = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("space-y-2.5", className)}
        {...props}
      />
    );
  }
);
FormControl.displayName = "FormControl";

export { Input, Label, FormControl };