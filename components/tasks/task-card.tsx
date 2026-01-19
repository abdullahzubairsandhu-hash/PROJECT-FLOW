// components/tasks/task-card.tsx

"use client";

import * as React from "react";
import Image from "next/image";
import { TaskStatusBadge } from "./task-status-badge";
import { TaskPriorityIndicator } from "./task-priority-indicator";
import { TaskCardActions } from "./task-card-actions";
import { EditTaskModal } from "./edit-task-modal";
import { DeleteTaskModal } from "./delete-task-modal";
import type { TaskWithDetails } from "@/types/task";
import { Calendar } from "lucide-react";
import Link from "next/link";

interface TaskCardProps {
  task: TaskWithDetails;
  canEdit: boolean;
  projectMembers?: Array<{
    id: string;
    userId: string;
    user: {
      id: string;
      email: string;
      firstName: string | null;
      lastName: string | null;
    };
  }>;
}

export function TaskCard({ task, canEdit, projectMembers = [] }: TaskCardProps) {
  const [isDeleted, setIsDeleted] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = React.useState(false);


  const assigneeInitials = task.assignee
    ? (task.assignee.firstName?.charAt(0) || task.assignee.email?.charAt(0) || "?").toUpperCase()
    : null;

  if (isDeleted) return null;

  return (
    <>
      <div className="group relative flex flex-col w-full rounded-xl border border-white/5 bg-zinc-900/10 p-4 transition-all duration-300 hover:bg-zinc-900/30 hover:border-white/10 hover:shadow-2xl">
  
        {/* ACTIONS — NOT INSIDE LINK */}
        {canEdit && (
          <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
            <TaskCardActions
              task={task}
              onEditClick={() => setIsEditModalOpen(true)}
              onDeleteClick={() => setIsDeleteModalOpen(true)}
            />
          </div>
        )}
  
        {/* CLICKABLE CARD CONTENT ONLY */}
        <Link
          href={`/projects/${task.projectId}/tasks/${task.id}`}
          className="block"
        >
          <div className="flex flex-col gap-4 cursor-pointer">
  
            {/* Row 1: Title */}
            <div className="pr-8">
              <h3 className="font-bold text-[13px] tracking-tight text-zinc-100 truncate">
                {task.title || "UNTITLED_TASK"}
              </h3>
            </div>
  
            {/* Row 2: Description & Date */}
            <div className="flex items-center justify-between gap-4">
              <p className="text-[11px] text-zinc-500 line-clamp-1 flex-1 font-medium">
                {task.description || "No description provided."}
              </p>
              {task.dueDate && (
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-white/[0.02] border border-white/5 text-[9px] font-bold text-zinc-500 shrink-0">
                  <Calendar size={10} className="text-zinc-600" />
                  <span>
                    {new Date(task.dueDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              )}
            </div>
  
            {/* Row 3: Metadata */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.03]">
              <div className="flex items-center gap-3">
                <TaskPriorityIndicator priority={task.priority} />
                <div onClick={(e) => e.preventDefault()}>
                  <TaskStatusBadge
                  taskId={task.id}
                  status={task.status}
                  canEdit={canEdit}
                  />
                  </div>
              </div>
  
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center p-0.5 rounded-full bg-zinc-950 border border-white/5">
                  <div className="relative w-5 h-5 rounded-full overflow-hidden ring-1 ring-white/10">
                    {task.assignee?.imageUrl ? (
                      <Image
                        src={task.assignee.imageUrl}
                        alt="Assignee"
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-zinc-800 flex items-center justify-center text-[8px] font-black text-zinc-400">
                        {assigneeInitials}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
  
          </div>
        </Link>
      </div>
  
      <EditTaskModal
        task={task}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        projectMembers={projectMembers}
      />
  
      <DeleteTaskModal
        task={task}
        open={isDeleteModalOpen}
        onOpenChange={setIsDeleteModalOpen}
        onDeleted={() => setIsDeleted(true)}
      />
    </>
  );
}  