// components/tasks/task-form.tsx

"use client";

import * as React from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Loader2, 
  Type, 
  AlignLeft, 
  Activity, 
  SignalHigh, 
  Calendar, 
  UserPlus, 
  ChevronRight 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
  assignee: z.string().optional(),
});

export type TaskFormValues = z.infer<typeof taskSchema>;

interface TaskFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<TaskFormValues>;
  onSubmit: (values: TaskFormValues) => void | Promise<void>;
  isSubmitting?: boolean;
}

export function TaskForm({
  mode,
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: TaskFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      dueDate: "",
      assignee: "",
      ...defaultValues,
    },
  });

  const labelClasses = "flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500 mb-2 ml-1";
  
  const inputClasses = (hasError?: boolean) => cn(
    "w-full bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-2.5 text-sm text-zinc-200 transition-all",
    "focus:outline-none focus:border-white/20 focus:bg-zinc-900",
    "placeholder:text-zinc-600 disabled:opacity-50 disabled:cursor-not-allowed",
    hasError && "border-red-500/50 focus:border-red-500"
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title */}
      <div className="space-y-1">
        <label className={labelClasses}>
          <Type size={12} /> Task Title
        </label>
        <input
          {...register("title")}
          placeholder="e.g., Database Migration"
          disabled={isSubmitting}
          className={inputClasses(!!errors.title)}
        />
        {errors.title && (
          <p className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-red-500 ml-1">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div className="space-y-1">
        <label className={labelClasses}>
          <AlignLeft size={12} /> Description
        </label>
        <textarea
          {...register("description")}
          rows={3}
          placeholder="Scope and technical requirements..."
          disabled={isSubmitting}
          className={cn(inputClasses(), "resize-none min-h-[100px]")}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status */}
        <div className="space-y-1">
          <label className={labelClasses}>
            <Activity size={12} /> Status
          </label>
          <select {...register("status")} disabled={isSubmitting} className={cn(inputClasses(), "appearance-none cursor-pointer")}>
            <option value="todo">Backlog</option>
            <option value="in_progress">Active</option>
            <option value="done">Complete</option>
          </select>
        </div>

        {/* Priority */}
        <div className="space-y-1">
          <label className={labelClasses}>
            <SignalHigh size={12} /> Priority
          </label>
          <select {...register("priority")} disabled={isSubmitting} className={cn(inputClasses(), "appearance-none cursor-pointer")}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Due Date */}
        <div className="space-y-1">
          <label className={labelClasses}>
            <Calendar size={12} /> Due Date
          </label>
          <input
            type="date"
            {...register("dueDate")}
            disabled={isSubmitting}
            className={cn(inputClasses(), "cursor-pointer")}
          />
        </div>

        {/* Assignee */}
        <div className="space-y-1">
          <label className={labelClasses}>
            <UserPlus size={12} /> Assignee
          </label>
          <input
            {...register("assignee")}
            placeholder="Search members..."
            disabled={isSubmitting}
            className={inputClasses()}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-6 border-t border-white/5">
        <Button
          type="submit"
          disabled={isSubmitting}
          className="h-12 px-8 bg-zinc-100 text-zinc-950 hover:bg-white font-bold text-[11px] uppercase tracking-[0.2em] shadow-xl transition-all active:scale-[0.98] group"
        >
          {isSubmitting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <>
              {mode === "create" ? "Initialize Task" : "Commit Changes"}
              <ChevronRight size={14} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </div>
    </form>
  );
}