"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-zinc-950 group-[.toaster]:text-zinc-100 group-[.toaster]:border-white/10 group-[.toaster]:shadow-2xl group-[.toaster]:rounded-xl font-mono text-[10px] uppercase tracking-widest",
          description: "group-[.toast]:text-zinc-500 font-sans normal-case tracking-normal text-[11px]",
          actionButton:
            "group-[.toast]:bg-zinc-100 group-[.toast]:text-zinc-950 font-bold",
          cancelButton:
            "group-[.toast]:bg-zinc-900 group-[.toast]:text-zinc-400",
          success: "group-[.toast]:border-emerald-500/50",
          error: "group-[.toast]:border-red-500/50",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }