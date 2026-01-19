// lib/auth.ts

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import type { User } from "@/types/user";

/**
 * getCurrentUser
 * The primary bridge between Clerk Identity and the Prisma Database.
 * Ensures every authenticated Clerk session has a corresponding record in our DB.
 */
export async function getCurrentUser(): Promise<User | null> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    // In a premium system, we fail early if the identity is incomplete.
    throw new Error("SECURE_AUTH_EXCEPTION: User identity missing primary email cluster.");
  }

  // Attempt to resolve the user in our registry
  let dbUser = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  // JIT (Just-In-Time) Provisioning: Create user if they don't exist in our DB yet
  if (!dbUser) {
    dbUser = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email,
        firstName: clerkUser.firstName ?? null,
        lastName: clerkUser.lastName ?? null,
        imageUrl: clerkUser.imageUrl ?? null,
      },
    });
  }

  // Standardize the display name for the high-precision UI
  const name = [dbUser.firstName, dbUser.lastName].filter(Boolean).join(" ") || email.split("@")[0];

  return {
    id: dbUser.id,
    clerkUserId: dbUser.clerkUserId,
    clerkId: dbUser.clerkUserId,
    email: dbUser.email,
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    name,
    imageUrl: dbUser.imageUrl,
    createdAt: dbUser.createdAt,
    updatedAt: dbUser.updatedAt,
  };
}

/**
 * requireAuth
 * A strict guard for protected Server Components and Actions.
 * Throws a redirect-friendly error if the session is unverified.
 */
export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("UNAUTHORIZED_ACCESS_PROTOCOL: Session verification failed.");
  }

  return user;
}