// lib/auth/get-current-user.ts

import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

interface PrismaUser {
  id: string;
  clerkUserId: string;
  email: string;
  name: string | null;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export async function getCurrentUser(): Promise<PrismaUser | null> {
  const clerkUser = await currentUser();

  if (!clerkUser) {
    return null;
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("User email not found");
  }

  let user = await prisma.user.findUnique({
    where: { clerkUserId: clerkUser.id },
  });

  if (!user) {
    const fullName = clerkUser.firstName && clerkUser.lastName
      ? `${clerkUser.firstName} ${clerkUser.lastName}`
      : clerkUser.firstName || clerkUser.lastName || null;

    user = await prisma.user.create({
      data: {
        clerkUserId: clerkUser.id,
        email,
        name: fullName,
        imageUrl: clerkUser.imageUrl || null,
      },
    });
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