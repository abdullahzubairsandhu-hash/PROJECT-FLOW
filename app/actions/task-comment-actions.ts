// app/actions/task-comment-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { createTaskComment } from "@/lib/tasks/task-comment-mutations";
import { updateTaskComment, deleteTaskComment } from "@/lib/tasks/task-comment-mutations";
import { ProjectRole } from "@prisma/client";

export async function addCommentAction(
  taskId: string, 
  projectId: string, 
  content: string
) {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    await createTaskComment(taskId, user.id, content);
    
    // Revalidate the task view
    revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
    
    return { success: true }; // Added return
  } catch (error) {
    console.error("ADD_COMMENT_ERROR:", error);
    return { success: false, error: "Failed to add comment" };
  }
}

export async function updateCommentAction(
    commentId: string,
    projectId: string,
    taskId: string,
    content: string
  ) {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("Unauthorized");
    
      await updateTaskComment(commentId, user.id, content);
      revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
      
      return { success: true }; // Added return
    } catch (error) {
      return { success: false, error: "Failed to update comment" };
    }
  }
  
  export async function deleteCommentAction(
    commentId: string,
    projectId: string,
    taskId: string,
    userRole: ProjectRole
  ) {
    try {
      const user = await getCurrentUser();
      if (!user) throw new Error("Unauthorized");
    
      await deleteTaskComment(commentId, user.id, userRole);
      revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
      
      return { success: true }; // Added return
    } catch (error) {
      return { success: false, error: "Failed to delete comment" };
    }
  }