// app/actions/task-comment-reaction-actions.ts


"use server";

import { revalidatePath } from "next/cache";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { toggleCommentReaction } from "@/lib/tasks/task-comment-reaction-mutations";

export async function toggleTaskCommentReactionAction(
  commentId: string,
  emoji: string,
  projectId: string,
  taskId: string
) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");

  await toggleCommentReaction(commentId, emoji, user.id);
  
  revalidatePath(`/projects/${projectId}/tasks/${taskId}`);
}