"use client";

import { useTransition } from "react";
import { cn } from "@/lib/utils";
import { CommentReactionSummary } from "@/types/task-comment-reaction";
import { toggleTaskCommentReactionAction } from "@/app/actions/task-comment-reaction-actions";
import { Smile, Plus } from "lucide-react";

interface CommentReactionsProps {
  commentId: string;
  projectId: string;
  taskId: string;
  reactions: CommentReactionSummary[];
}

const EMOJI_LIST = ["👍", "❤️", "😂", "🎉", "👀", "🚀"];

export function CommentReactions({
  commentId,
  projectId,
  taskId,
  reactions,
}: CommentReactionsProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = (emoji: string) => {
    if (isPending) return;
    startTransition(async () => {
      try {
        await toggleTaskCommentReactionAction(commentId, emoji, projectId, taskId);
      } catch (error) {
        console.error("Sync error:", error);
      }
    });
  };

  const activeReactions = reactions.filter((r) => r.count > 0);

  return (
    <div className="flex flex-wrap items-center gap-1.5 mt-3 group/reaction-container">
      {/* Active Reactions */}
      {activeReactions.map((reactionData) => (
        <button
          key={reactionData.emoji}
          onClick={() => handleToggle(reactionData.emoji)}
          disabled={isPending}
          className={cn(
            "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-bold transition-all duration-200",
            reactionData.reactedByCurrentUser
              ? "bg-zinc-100 border-zinc-100 text-zinc-950 shadow-[0_0_10px_rgba(255,255,255,0.1)]"
              : "bg-zinc-900 border-white/5 text-zinc-400 hover:border-white/20 hover:text-zinc-200",
            isPending && "opacity-50 cursor-wait"
          )}
        >
          <span>{reactionData.emoji}</span>
          <span>{reactionData.count}</span>
        </button>
      ))}

      {/* Emoji Picker Trigger / Quick List */}
      <div className="flex items-center gap-1 opacity-0 group-hover/reaction-container:opacity-100 transition-opacity duration-300">
        <div className="h-4 w-[1px] bg-white/5 mx-1" />
        
        {/* Smile Icon used as the visual identifier for reactions */}
        <div className="p-1 text-zinc-600">
          <Smile size={14} strokeWidth={2} />
        </div>
        
        {EMOJI_LIST.map((emoji) => {
          const isAlreadyActive = activeReactions.some(r => r.emoji === emoji);
          if (isAlreadyActive) return null;

          return (
            <button
              key={emoji}
              onClick={() => handleToggle(emoji)}
              disabled={isPending}
              className="p-1 rounded-md hover:bg-zinc-800 text-xs grayscale hover:grayscale-0 transition-all active:scale-90"
            >
              {emoji}
            </button>
          );
        })}
        
        {/* Plus Icon used for the 'Add New' action */}
        <button className="p-1 rounded-md hover:bg-zinc-800 text-zinc-500 hover:text-zinc-200">
          <Plus size={12} />
        </button>
      </div>
    </div>
  );
}