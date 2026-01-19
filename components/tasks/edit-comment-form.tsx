// components/tasks/edit-comment-form.tsx

"use client";

import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateCommentAction } from "@/app/actions/task-comment-actions";
import { Loader2, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EditCommentFormProps {
  commentId: string;
  projectId: string;
  taskId: string;
  initialContent: string;
  onCancel: () => void;
}

export function EditCommentForm({
  commentId,
  projectId,
  taskId,
  initialContent,
  onCancel,
}: EditCommentFormProps) {
  const [content, setContent] = React.useState(initialContent);
  const [isPending, startTransition] = React.useTransition();

  const handleSave = () => {
    if (!content.trim() || content === initialContent) return onCancel();
    startTransition(async () => {
      try {
        await updateCommentAction(commentId, projectId, taskId, content);
        onCancel();
      } catch (error) {
        console.error("UPDATE_ERROR: Protocol interrupt", error);
      }
    });
  };

  return (
    <div className="w-full mt-2 space-y-3 animate-in fade-in zoom-in-95 duration-200">
      <div className="relative group">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          placeholder="Revise comment..."
          className={cn(
            "min-h-[100px] w-full resize-none rounded-xl border-white/5 bg-zinc-900/50 p-4 text-sm text-zinc-200 shadow-inner transition-all focus-visible:ring-1 focus-visible:ring-white/10 focus-visible:border-white/10",
            isPending && "opacity-50 cursor-wait"
          )}
        />
        {/* Subtle decorative edge to indicate 'editing' mode */}
        <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-zinc-700 rounded-l-xl" />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.2em] px-1">
          Edit Mode
        </span>
        
        <div className="flex gap-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onCancel} 
            disabled={isPending}
            className="h-8 px-3 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-md transition-all gap-1.5"
          >
            <X size={12} />
            <span className="text-[10px] font-bold uppercase tracking-wider">Cancel</span>
          </Button>
          
          <Button 
            size="sm" 
            onClick={handleSave} 
            disabled={isPending || !content.trim() || content === initialContent}
            className="h-8 px-4 bg-zinc-100 text-zinc-950 hover:bg-white rounded-md transition-all gap-1.5 shadow-[0_1px_10px_rgba(255,255,255,0.1)] active:scale-95"
          >
            {isPending ? (
              <Loader2 size={12} className="animate-spin" />
            ) : (
              <>
                <Check size={12} strokeWidth={3} />
                <span className="text-[10px] font-bold uppercase tracking-wider">Save</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}