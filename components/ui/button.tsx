// components/ui/button.tsx

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-[11px] font-black uppercase tracking-[0.15em] transition-all duration-300 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-30 active:scale-[0.98]",
  {
    variants: {
      variant: {
        // High-contrast primary
        default: "bg-zinc-100 text-zinc-950 hover:bg-white shadow-lg shadow-black/20",
        // Subdued secondary
        secondary: "bg-zinc-900 text-zinc-100 border border-white/5 hover:bg-zinc-800 hover:border-white/10",
        // Aggressive destructive
        destructive: "bg-red-950/20 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white",
        // Minimalist outline
        outline: "border border-white/10 bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03] hover:border-white/20",
        // Clean ghost
        ghost: "text-zinc-500 hover:text-zinc-100 hover:bg-white/[0.03]",
        // Sophisticated link
        link: "text-zinc-400 underline-offset-8 hover:text-white hover:underline decoration-zinc-700",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4",
        lg: "h-12 px-10 text-[12px]",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

    const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
      ({ className, variant, size, ...props }, ref) => {
        return (
          <button
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props} // Corrected: wrapped in curly braces
          />
        );
      }
    );

Button.displayName = "Button";

export { Button, buttonVariants };