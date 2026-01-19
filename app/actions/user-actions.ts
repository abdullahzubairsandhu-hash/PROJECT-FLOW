// app/actions/user-actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import type { User } from "@/types/user";

interface ClerkUserData {
  id: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
}

interface SyncUserResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Syncs a Clerk user to the Prisma User table
 * Creates a new user if they don't exist, or returns existing user
 */
export async function syncClerkUserToPrisma(
  clerkUser: ClerkUserData
): Promise<SyncUserResult> {
  try {
    if (!clerkUser.id || !clerkUser.email) {
      return {
        success: false,
        error: "Invalid user data: id and email are required",
      };
    }

    // Check if user already exists by Clerk ID
    let user = await prisma.user.findUnique({
      where: { clerkUserId: clerkUser.id },
    });

    // If not found by Clerk ID, check by email
    if (!user) {
      user = await prisma.user.findFirst({
        where: { email: clerkUser.email.toLowerCase() },
      });

      // If found by email but with different Clerk ID, update clerkUserId
      if (user && user.clerkUserId !== clerkUser.id) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { clerkUserId: clerkUser.id },
        });
      }
    }

    // If user still doesn't exist, create a new record
    if (!user) {
      user = await prisma.user.create({
        data: {
          clerkUserId: clerkUser.id,
          email: clerkUser.email.toLowerCase(),
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          imageUrl: clerkUser.imageUrl || null,
        },
      });
    }

    // Map firstName + lastName into a convenience name property
    const fullName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

    return {
      success: true,
      user: {
        id: user.id,
        clerkUserId: user.clerkUserId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        name: fullName, // convenience for UI
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  } catch (error) {
    console.error("Failed to sync Clerk user to Prisma:", error);
    return {
      success: false,
      error: "Failed to sync user data. Please try again.",
    };
  }
}

/**
 * Get the current authenticated user from Prisma
 */
export async function getPrismaUser(clerkUserId: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkUserId },
    });

    if (!user) return null;

    const fullName =
      [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

    return {
      id: user.id,
      clerkUserId: user.clerkUserId,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      imageUrl: user.imageUrl,
      name: fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Failed to fetch Prisma user:", error);
    return null;
  }
}
