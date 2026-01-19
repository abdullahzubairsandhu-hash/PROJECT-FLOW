// lib/prisma.ts

import { PrismaClient } from "@prisma/client";

/**
 * Prisma Singleton Pattern
 * Ensures only one instance of the Prisma Client is active at any time.
 * This prevents "Too many connections" errors during Next.js Hot Module Replacement (HMR).
 */

const prismaClientSingleton = () => {
  return new PrismaClient({
    // Only log critical system failures in the "Command Center"
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

// Export the singleton instance
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

// Registry protection: In non-production environments, we attach the instance 
// to the global object to survive hot reloads.
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}