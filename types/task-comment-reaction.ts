export interface CommentReactionSummary {
    emoji: string;
    count: number;
    reactedByCurrentUser: boolean;
  }
  
  export type ReactionEmoji = "👍" | "❤️" | "😄" | "👀" | "🚀" | "👎";
  
  export const ALLOWED_REACTIONS: ReactionEmoji[] = ["👍", "❤️", "😄", "👀", "🚀", "👎"];