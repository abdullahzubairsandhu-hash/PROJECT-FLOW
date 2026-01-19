// components/tasks/task-comments.tsx

"use client";

import * as React from "react";
import { TaskCommentWithAuthor } from "@/types/task-comment";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { addCommentAction } from "@/app/actions/task-comment-actions";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { ProjectRole } from "@prisma/client";
import { Loader2, MessageSquare, Send } from "lucide-react";

import { TaskCommentActions } from "./task-comment-actions";
import { EditCommentForm } from "./edit-comment-form";
import { CommentReactions } from "./comment-reactions";
import { canEditTaskComment, canDeleteTaskComment } from "@/lib/tasks/task-comment-client-permissions";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface TaskCommentsProps {
  taskId: string;
  projectId: string;
  initialComments: TaskCommentWithAuthor[];
  currentUserId: string;
  currentUserRole: ProjectRole;
}


export function TaskComments({ 
  taskId, 
  projectId, 
  initialComments,
  currentUserId,
  currentUserRole 
}: TaskCommentsProps) {
  const [content, setContent] = React.useState("");
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [isPending, startTransition] = React.useTransition();

  const router = useRouter();

  const handleSubmit = async () => {
    // Prevent empty submissions or double-clicks during pending state
    if (!content.trim() || isPending) return;
  
    startTransition(async () => {
      try {
        const result = await addCommentAction(taskId, projectId, content);
        
        if (result?.success) {
          // Clear the input only on success
          setContent("");
          // Force Next.js to re-fetch the server component data (initialComments)
          router.refresh(); 
        } else {
          // Handle the case where the server caught an error
          console.error("PROTOCOL_REJECTION:", result?.error || "Unknown Error");
          // Optional: toast.error(result?.error) if you use a toast library
        }
      } catch (error) {
        // Handle network-level or unexpected crashes
        console.error("LOG_ERROR: Protocol interrupt", error);
      }
    });
  };

  return (
    
    
    <div className="mt-12 border-t border-white/5 pt-10 space-y-10">
      <div className="flex items-center gap-3">
        <MessageSquare size={16} className="text-zinc-500" />
        <h3 className="text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-400">
          Activity Log ({initialComments.length})
        </h3>
      </div>
      

      <div className="space-y-8">
      {initialComments.length === 0 && (
  <div className="rounded-2xl border border-dashed border-white/10 bg-zinc-900/30 p-8 text-center animate-in fade-in">
    <MessageSquare className="mx-auto mb-4 h-5 w-5 text-zinc-500" />
    <p className="text-sm font-medium text-zinc-300">
      No activity yet
    </p>
    <p className="mt-1 text-xs text-zinc-500">
      Be the first to add a comment to this task.
    </p>
  </div>
)}

        {initialComments.map((comment) => {
          const isEditing = editingId === comment.id;
          const canEdit = canEditTaskComment(comment, currentUserId);
          const canDelete = canDeleteTaskComment(comment, currentUserId, currentUserRole);

          return (
            <div key={comment.id} className="flex gap-5 group animate-in fade-in slide-in-from-left-2 duration-500">
              <div className="relative h-9 w-9 flex-shrink-0">
                <div className="h-full w-full rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center overflow-hidden">
                  {comment.author.imageUrl ? (
                    <Image
                      src={comment.author.imageUrl}
                      alt="Author"
                      width={36}
                      height={36}
                      className="object-cover h-full w-full grayscale hover:grayscale-0 transition-all duration-500"
                    />
                  ) : (
                    <span className="text-[10px] font-black text-zinc-500 uppercase">
                      {comment.author.firstName?.[0] || "?"}
                    </span>
                  )}
                </div>
                {/* Vertical line connector for a 'thread' look */}
                <div className="absolute top-10 bottom-[-32px] left-1/2 w-px bg-zinc-900 group-last:hidden" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <p className="text-[12px] font-bold text-zinc-200 tracking-tight">
                      {comment.author.firstName} {comment.author.lastName}
                    </p>
                    <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
                      {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                    </span>
                  </div>

                  {!isEditing && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <TaskCommentActions
                        commentId={comment.id}
                        projectId={projectId}
                        taskId={taskId}
                        userRole={currentUserRole}
                        canEdit={canEdit}
                        canDelete={canDelete}
                        onEditClick={() => setEditingId(comment.id)}
                      />
                    </div>
                  )}
                </div>

                {isEditing ? (
                  <EditCommentForm
                    commentId={comment.id}
                    projectId={projectId}
                    taskId={taskId}
                    initialContent={comment.content}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap font-light">
                      {comment.content}
                    </p>
                    <CommentReactions
                      commentId={comment.id}
                      projectId={projectId}
                      taskId={taskId}
                      reactions={comment.reactions || []}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Comment Input */}
      <div className="relative space-y-4 pt-4">
        <div className="group relative">
          <Textarea
            placeholder="Append to log..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isPending}
            className={cn(
              "min-h-[120px] w-full resize-none rounded-2xl border-white/5 bg-zinc-900/30 p-5 text-sm text-zinc-200 transition-all",
              "focus-visible:ring-1 focus-visible:ring-white/10 focus-visible:bg-zinc-900/50",
              isPending && "opacity-50"
            )}
          />
          <div className="absolute right-4 bottom-4">
            <Button 
              size="sm"
              disabled={isPending || !content.trim()} 
              onClick={handleSubmit}
              className="h-9 px-4 bg-zinc-100 text-zinc-950 hover:bg-white rounded-xl transition-all gap-2 shadow-xl shadow-black/20"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Commit</span>
                  <Send size={14} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}