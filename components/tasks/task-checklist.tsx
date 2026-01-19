// components/tasks/task-checklist.tsx

"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { ListTodo, Plus, Loader2 } from "lucide-react";
import { toggleExecutionItem, addExecutionItem } from "@/app/actions/checklist-actions";
import { Trash2, } from "lucide-react";
import { deleteExecutionItem } from "@/app/actions/checklist-actions";


interface ChecklistItem {
  id: string;
  content: string;
  completed: boolean;
}

export function ExecutionChecklist({ 
  taskId, 
  initialItems 
}: { 
  taskId: string; 
  initialItems: ChecklistItem[] 
}) {
  const [items, setItems] = React.useState(initialItems);
  const [isAdding, setIsAdding] = React.useState(false);

  // 1. Toggle Persistence
  const handleToggle = async (itemId: string, currentStatus: boolean) => {
    // Optimistic Update: Change UI immediately
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, completed: !currentStatus } : item
    ));

    try {
      await toggleExecutionItem(itemId, taskId, !currentStatus);
    } catch (error) {
      // Rollback on failure
      setItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, completed: currentStatus } : item
      ));
      console.error("Failed to sync status", error);
    }
  };

  // 2. Add Persistence
  const handleAddItem = async () => {
    const content = prompt("Enter new instruction:"); // Simple for now
    if (!content) return;

    const tempId = crypto.randomUUID();
    const newItem = { id: tempId, content, completed: false };

    setItems(prev => [...prev, newItem]);
    setIsAdding(true);
    try {
      await addExecutionItem(taskId, content);
      // Note: RevalidatePath in the action will update initialItems automatically
    } catch (error) {
        // If it fails, remove the fake item
        setItems(prev => prev.filter(item => item.id !== tempId));
        console.error("Failed to add item", error);
    
    } finally {
      setIsAdding(false);
    }
  };
  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const progress = items.length > 0 
    ? Math.round((items.filter(i => i.completed).length / items.length) * 100) 
    : 0;

  return (
    <section className="space-y-6 animate-in slide-in-from-bottom-2 duration-500">
      <div className="space-y-4 border-b border-white/5 pb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded bg-emerald-500/10">
              <ListTodo size={14} className="text-emerald-500" />
            </div>
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-100">
              Execution_Checklist
            </h3>
          </div>
          <span className="font-mono text-[10px] text-emerald-500 font-bold">
            {progress}%_COMPLETE
          </span>
        </div>
        
        <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500 ease-out shadow-[0_0_8px_rgba(16,185,129,0.5)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid gap-3">
        {items.map((item) => (
          <div 
            key={item.id}
            onClick={() => handleToggle(item.id, item.completed)}
            className={cn(
              "group flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all duration-300",
              item.completed 
                ? "bg-emerald-500/[0.02] border-emerald-500/20" 
                : "bg-zinc-900/40 border-white/5 hover:border-white/10"
            )}
          >
            <Checkbox checked={item.completed} />
            <span className={cn(
              "text-xs font-semibold transition-all duration-500 flex-1",
              item.completed ? [
                "text-zinc-600",
                "line-through decoration-emerald-500/60 decoration-[1.5px] italic" 
              ] : "text-zinc-300"
            )}>
              {item.content}
            </span>
            <button
            onClick={async () => {
              if (confirm("Delete this instruction?")) {
                await deleteExecutionItem(item.id, taskId);
              }
            }}
            className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md text-zinc-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="Remove Item"
            >
              <Trash2 size={14} />
              </button>
          </div>
        ))}
        
        <button 
          onClick={handleAddItem}
          disabled={isAdding}
          className="flex items-center justify-center gap-2 py-4 border border-dashed border-white/5 rounded-xl text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/30 transition-all disabled:opacity-50"
        >
          {isAdding ? <Loader2 size={12} className="animate-spin" /> : <Plus size={12} />}
          Append_Instruction
        </button>
      </div>
    </section>
  );
}