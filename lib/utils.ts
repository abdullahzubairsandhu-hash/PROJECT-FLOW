// lib/utilis.ts

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn: Class Name Merger
 * Combines tailwind-merge and clsx to handle conditional styling
 * without class conflicts. The foundation of our "System UI".
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * formatDate: Technical Chronology
 * Formats dates into a clean, professional string.
 * Example: Jan 02, 2026
 */
export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }
) {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
}

/**
 * truncateIdentifier: Registry Cleaning
 * Shortens long IDs (like UUIDs) for display in technical badges.
 * Example: "project_cl9k..."
 */
export function truncateIdentifier(id: string, length: number = 8) {
  if (id.length <= length) return id;
  return `${id.slice(0, length)}...`;
}