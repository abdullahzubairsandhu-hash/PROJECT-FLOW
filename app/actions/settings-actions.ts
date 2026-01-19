// app/actions/settings-actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";
import { revalidatePath } from "next/cache";

export async function updateProfile(formData: {
  firstName: string;
  lastName: string;
  designation: string;
}) {
  const user = await requireUser();

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        designation: formData.designation,
      },
    });

    revalidatePath("/settings");
    revalidatePath("/members");

    return { success: true };
  } catch (error) {
    console.error("SETTINGS_UPDATE_ERROR:", error);
    return { success: false, error: "Failed to update protocol." };
  }
}