import { prisma } from "@/lib/prisma";
import { canReactToComment } from "./task-comment-reaction-permissions";

export async function toggleCommentReaction(
  commentId: string,
  emoji: string,
  userId: string
) {
  await canReactToComment(commentId, userId);

  const existing = await prisma.taskCommentReaction.findUnique({
    where: {
      commentId_userId_emoji: { commentId, userId, emoji }
    }
  });

  if (existing) {
    await prisma.taskCommentReaction.delete({
      where: { id: existing.id }
    });
    return { action: 'removed' };
  } else {
    await prisma.taskCommentReaction.create({
      data: { commentId, userId, emoji }
    });
    return { action: 'added' };
  }
}