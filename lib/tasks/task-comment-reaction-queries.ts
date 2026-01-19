import { prisma } from "@/lib/prisma";
import { CommentReactionSummary } from "@/types/task-comment-reaction";

export async function getCommentReactions(
  commentId: string,
  userId: string
): Promise<CommentReactionSummary[]> {
  const reactions = await prisma.taskCommentReaction.groupBy({
    by: ['emoji'],
    where: { commentId },
    _count: { _all: true },
  });

  const userReactions = await prisma.taskCommentReaction.findMany({
    where: { commentId, userId },
    select: { emoji: true }
  });

  const userEmojiSet = new Set(userReactions.map(r => r.emoji));

  return reactions.map(r => ({
    emoji: r.emoji,
    count: r._count._all,
    reactedByCurrentUser: userEmojiSet.has(r.emoji)
  }));
}