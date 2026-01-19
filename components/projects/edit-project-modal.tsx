// components/projects/edit-project-modal.tsx

"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Settings2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Fix 3: Corrected z.object
const formSchema = z.object({
  name: z.string().min(1, "Name is required").max(50),
  description: z.string().max(200).optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditProjectModalProps {
  project: {
    id: string;
    name: string;
    description: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditProjectModal({ project, open, onOpenChange }: EditProjectModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: project.name,
      description: project.description || "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsPending(true);
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error("Update failed");

      toast.success("PARAMETERS_SYNCED", {
        description: "Project metadata has been successfully updated.",
      });
      router.refresh();
      onOpenChange(false);
    } catch { // Fix 4: Prefixed with underscore to allow unused variable
      toast.error("SYNC_ERROR", { description: "Failed to update project parameters." });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-white/10 sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Settings2 size={16} className="text-emerald-500" />
            <DialogTitle className="text-xs font-black uppercase tracking-[0.3em] text-zinc-100 font-mono">
              Modify_Project_Parameters
            </DialogTitle>
          </div>
          <DialogDescription className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
            Registry_Node: {project.id.slice(-12).toUpperCase()}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => ( // Fix 5 & 6: Type inherited from FormValues
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Project_Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="bg-zinc-900/50 border-white/5 focus:border-emerald-500/50 rounded-xl h-10" />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">System_Brief</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="bg-zinc-900/50 border-white/5 focus:border-emerald-500/50 rounded-xl min-h-[100px] resize-none" />
                  </FormControl>
                  <FormMessage className="text-[10px] uppercase font-bold text-red-500" />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5">
                Abort_Action
              </Button>
              <Button type="submit" disabled={isPending} className="bg-zinc-100 text-zinc-950 hover:bg-white rounded-xl px-8 font-black text-[10px] uppercase tracking-widest transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {isPending ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
                Commit_Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}