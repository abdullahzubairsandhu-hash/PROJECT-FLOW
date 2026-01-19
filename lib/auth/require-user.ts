// lib/auth/require-user.ts

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface AuthUser {
  id: string;
  clerkUserId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function requireUser(): Promise<AuthUser> {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId },
  });

  if (!user) {
    throw new Error("User not found in database");
  }

  const name =
  [user.firstName, user.lastName].filter(Boolean).join(" ") || null;

return {
  id: user.id,
  clerkUserId: user.clerkUserId,
  email: user.email,
  name,
  imageUrl: user.imageUrl,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
};
}