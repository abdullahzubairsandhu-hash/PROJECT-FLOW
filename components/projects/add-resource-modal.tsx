// components/projects/add-resource-modal.tsx

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
import { Box, Loader2, Plus, FileIcon, X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing"; 
import type { ClientUploadedFileData } from "uploadthing/types";

const resourceSchema = z.object({
  title: z.string().min(1, "Name required").max(100),
  description: z.string().max(200),
  type: z.enum(["LINK", "FILE", "IMAGE", "ARCHIVE"]),
  url: z.string().min(1, "Target source required"),
});

type ResourceValues = z.infer<typeof resourceSchema>;

interface UploadResult {
  uploadedBy: string;
  url: string;
}

interface AddResourceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddResourceModal({ open, onOpenChange }: AddResourceModalProps) {
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);
  
  // Track the name of the uploaded file for UI feedback
  const [uploadedFileName, setUploadedFileName] = React.useState<string | null>(null);

  const form = useForm<ResourceValues>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      title: "",
      description: "",
      url: "",
      type: "LINK",
    },
  });

  const urlValue = form.watch("url");
  const typeValue = form.watch("type");

  async function onSubmit(values: ResourceValues) {
    setIsPending(true);
    try {
      const response = await fetch("/api/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!response.ok) throw new Error();

      toast.success("ASSET_INITIALIZED");
      form.reset();
      setUploadedFileName(null);
      router.refresh();
      onOpenChange(false);
    } catch {
      toast.error("INITIALIZATION_FAILED");
    } finally {
      setIsPending(false);
    }
  }

  // Handle clearing the uploaded file if they change their mind
  const clearFile = () => {
    form.setValue("url", "");
    setUploadedFileName(null);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-white/10 sm:max-w-[425px] rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Box size={16} className="text-blue-500" />
            <DialogTitle className="text-xs font-black uppercase tracking-[0.3em] text-zinc-100 font-mono">
              Register_New_Asset
            </DialogTitle>
          </div>
          <DialogDescription className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">
            Vault_Sync_Protocol_V1
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 pt-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Asset_Title</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      placeholder="Resource name..." 
                      className="bg-zinc-900/50 border-white/5 focus:border-blue-500/50 rounded-xl h-10 text-xs text-zinc-100" 
                    />
                  </FormControl>
                  <FormMessage className="text-[9px] uppercase font-bold text-red-500" />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Asset_Class</FormLabel>
                  <select 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                      clearFile(); // Reset file if type changes
                    }}
                    className="w-full bg-zinc-900/50 border border-white/5 rounded-xl h-10 text-[10px] font-bold text-zinc-100 px-3 outline-none focus:border-blue-500/50 uppercase font-mono"
                  >
                    <option value="LINK">Web_Reference</option>
                    <option value="FILE">System_Document</option>
                    <option value="IMAGE">Visual_Data</option>
                  </select>
                </FormItem>
              )}
            />

            {typeValue === "LINK" ? (
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Target_URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." className="bg-zinc-900/50 border-white/5 rounded-xl h-10 text-xs text-zinc-100" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ) : (
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Local_Sync</label>
                
                {urlValue ? (
                  /* --- SUCCESS STATE UI --- */
                  <div className="flex items-center justify-between w-full p-4 border border-emerald-500/30 rounded-2xl bg-emerald-500/5 group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-lg">
                      {/* Now using FileIcon so the import is used! */}
                      <FileIcon size={16} className="text-emerald-500" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-emerald-500 uppercase font-mono leading-none mb-1">
                          Asset_Staged
                          </span>
                          <span className="text-[11px] text-zinc-300 font-mono line-clamp-1 break-all">
                            {uploadedFileName || "File_Ready"}
                            </span>
                            </div>
                            </div>
                            <Button 
                            type="button" 
                            variant="ghost" 
                            onClick={clearFile}
                            className="h-8 w-8 p-0 hover:bg-red-500/10 hover:text-red-500 text-zinc-500 transition-colors"
                            >
                              <X size={14} />
                              </Button>
                   </div>
                ) : (
                  /* --- UPLOAD STATE UI --- */
                  <div className="flex items-center justify-center w-full min-h-[100px] border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
                    <UploadButton
                      endpoint="vaultAsset"
                      onClientUploadComplete={(res: ClientUploadedFileData<UploadResult>[]) => {
                        if (res?.[0]) {
                          form.setValue("url", res[0].url);
                          setUploadedFileName(res[0].name);
                          if (!form.getValues("title")) {
                            form.setValue("title", res[0].name);
                          }
                          toast.success("FILE_UPLOADED");
                        }
                      }}
                      onUploadError={(error: Error) => {
                        toast.error("UPLOAD_ERROR", { description: error.message });
                      }}
                      appearance={{
                        button: "bg-zinc-100 text-zinc-950 font-black text-[10px] uppercase tracking-widest rounded-xl w-full h-10",
                        container: "w-full p-4",
                        allowedContent: "text-[9px] uppercase font-bold text-zinc-600 mt-2"
                      }}
                      content={{
                        button: ({ ready }: { ready: boolean }) => {
                          if (ready) return <div className="flex items-center gap-2"><Plus size={14} /> Browse_System</div>;
                          return <Loader2 className="h-4 w-4 animate-spin" />;
                        },
                      }}
                    />
                  </div>
                )}
              </div>
            )}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">System_Brief</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Optional metadata..." 
                      className="bg-zinc-900/50 border-white/5 focus:border-blue-500/50 rounded-xl min-h-[80px] resize-none text-xs text-zinc-100" 
                    />
                  </FormControl>
                  <FormMessage className="text-[9px] uppercase font-bold text-red-500" />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-2">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => onOpenChange(false)} 
                className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5"
              >
                Abort
              </Button>
              <Button 
                type="submit" 
                disabled={isPending || !urlValue} 
                className={`rounded-xl px-8 font-black text-[10px] uppercase tracking-widest transition-all disabled:opacity-50 ${
                  urlValue ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-zinc-100 text-zinc-950 hover:bg-white"
                }`}
              >
                {isPending && <Loader2 className="h-3 w-3 animate-spin mr-2" />}
                Init_Sync
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}