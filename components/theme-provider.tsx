"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, type ThemeProviderProps } from "next-themes";

/**
 * ThemeProvider
 * * Orchestrates the monochromatic 'Dark Mode' environment. 
 * Even if system settings change, this provider ensures the 
 * custom Zinc-950 palette is applied consistently.
 */
export function ThemeProvider({ 
  children, 
  ...props 
}: ThemeProviderProps) {
  return (
    <NextThemesProvider 
      attribute="class" 
      defaultTheme="dark" 
      enableSystem={false} // Often better for "Luxury" apps to force the intended dark aesthetic
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}