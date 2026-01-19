// app/actions/checklist-actions.ts

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createNotification } from "@/lib/notifications/notification-mutations";
import { getCurrentUser } from "@/lib/auth/get-current-user";

export async function addExecutionItem(taskId: string, content: string) {
  const user = await getCurrentUser();
  
  const newItem = await prisma.executionItem.create({
    data: { taskId, content, completed: false },
    include: { 
      task: {
        select: { creatorId: true, title: true, projectId: true }
      } 
    }
  });

  // Always notify if someone else is adding items to the creator's task
  if (user?.id !== newItem.task.creatorId) {
    await createNotification({
      userId: newItem.task.creatorId,
      type: "CHECKLIST_UPDATED",
      entityId: taskId,
      message: `New Instruction: "${content}" added to task "${newItem.task.title}".`,
    });
  }

  // Use the actual IDs for revalidation
  revalidatePath(`/projects/${newItem.task.projectId}/tasks/${taskId}`);
  revalidatePath("/dashboard");
}

export async function toggleExecutionItem(itemId: string, taskId: string, completed: boolean) {
  try {
    // 1. Update the item and get full context
    const updatedItem = await prisma.executionItem.update({
      where: { id: itemId },
      data: { completed },
      include: { 
        task: {
          select: { 
            creatorId: true, 
            title: true, 
            projectId: true 
          }
        } 
      }
    });

    // 2. Trigger Notification only if item was successfully updated and is now completed
    if (updatedItem && completed) {
      await createNotification({
        userId: updatedItem.task.creatorId,
        type: "CHECKLIST_UPDATED",
        entityId: taskId,
        message: `Complete: "${updatedItem.content}" in task "${updatedItem.task.title}".`,
      });
    }

    // 3. Revalidate
    revalidatePath(`/projects/${updatedItem.task.projectId}/tasks/${taskId}`);
    revalidatePath("/dashboard");

  } catch (error) {
    // This catches the "Record not found" error
    console.error("Failed to toggle item - it might have been deleted:", error);
    
    // Refresh the page anyway to make sure the UI syncs with the fact that it's gone
    revalidatePath("/dashboard");
    return { error: "Item no longer exists" };
  }
}

export async function deleteExecutionItem(itemId: string, taskId: string) {
  // 1. Get the item first to know which project to revalidate
  const item = await prisma.executionItem.findUnique({
    where: { id: itemId },
    include: { task: { select: { projectId: true } } }
  });

  if (!item) return;

  // 2. Delete
  await prisma.executionItem.delete({
    where: { id: itemId },
  });

  // 3. Revalidate the specific task page and the dashboard
  revalidatePath(`/projects/${item.task.projectId}/tasks/${taskId}`);
  revalidatePath("/dashboard");
}
