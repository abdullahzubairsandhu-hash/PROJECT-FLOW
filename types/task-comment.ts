// types/task-comment.ts

import { TaskComment, User } from "@prisma/client";
import { CommentReactionSummary } from "./task-comment-reaction"; // Import the summary type

export type TaskCommentWithAuthor = TaskComment & {
  author: Pick<User, "id" | "email" | "firstName" | "lastName" | "imageUrl">;
  reactions?: CommentReactionSummary[]; // 👈 Add this line to the type
};