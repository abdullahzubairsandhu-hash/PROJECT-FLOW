// components/projects/resource-card.tsx

"use client";

import * as React from "react";
import { 
  MoreVertical, 
  ExternalLink, 
  Trash2,  
  FileText, 
  Image as ImageIcon, 
  Globe,
  Download,
  Loader2 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ResourceCardProps {
  resource: {
    id: string;
    title: string;
    description: string | null;
    url: string;
    type: string;
  };
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isMounted, setIsMounted] = React.useState(false);

  // Fix for Hydration Mismatch: Only render interactive parts after mounting
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  const getAssetMeta = () => {
    switch (resource.type) {
      case "IMAGE":
        return { icon: ImageIcon, color: "text-emerald-500", bg: "bg-emerald-500/10" };
      case "FILE":
        return { icon: FileText, color: "text-amber-500", bg: "bg-amber-500/10" };
      default:
        return { icon: Globe, color: "text-blue-500", bg: "bg-blue-500/10" };
    }
  };

  const { icon: Icon, color, bg } = getAssetMeta();

  async function onDelete() {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/resources/${resource.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error();
      toast.success("ASSET_PURGED");
      router.refresh();
    } catch {
      toast.error("PURGE_FAILED");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="group relative flex flex-col rounded-2xl border border-white/[0.03] bg-zinc-900/20 transition-all hover:bg-zinc-900/40 hover:border-white/10 overflow-hidden">
      {/* 1. Preview Area */}
      <div className="relative h-32 w-full bg-zinc-950/50 flex items-center justify-center border-b border-white/[0.02]">
        {resource.type === "IMAGE" ? (
          <Image 
            src={resource.url} 
            alt={resource.title} 
            fill 
            className="object-cover opacity-60 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <Icon size={32} className={`${color} opacity-40`} />
        )}
        
        <div className="absolute top-2 right-2">
          {/* Only render the menu if the component has mounted to prevent ID mismatch */}
          {isMounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  suppressHydrationWarning
                  className="h-8 w-8 p-0 text-zinc-500 hover:text-white bg-zinc-950/50 backdrop-blur-md"
                >
                  <MoreVertical size={14} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-zinc-950 border-white/10 text-zinc-100">
                <DropdownMenuItem 
                  onClick={onDelete} 
                  disabled={isDeleting} 
                  className="text-red-500 text-[10px] font-bold uppercase cursor-pointer"
                >
                  {isDeleting ? <Loader2 className="animate-spin mr-2 h-3" /> : <Trash2 className="mr-2 h-3" />}
                  Purge_Asset
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* 2. Content Area */}
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1.5 rounded-md ${bg} ${color}`}>
            <Icon size={12} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 font-mono">
            {resource.type}_BLOB
          </span>
        </div>

        <h3 className="text-[11px] font-black uppercase tracking-widest text-zinc-100 line-clamp-1 mb-1">
          {resource.title}
        </h3>
        <p className="text-[10px] text-zinc-500 line-clamp-2 uppercase leading-relaxed tracking-tight">
          {resource.description || "NO_METADATA"}
        </p>

        <div className="mt-6">
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/[0.03] border border-white/5 py-2.5 text-[10px] font-black uppercase tracking-tighter text-zinc-100 hover:bg-white hover:text-zinc-950 transition-all"
          >
            {resource.type === "LINK" ? "Access_Link" : "Download_Asset"}
            {resource.type === "LINK" ? <ExternalLink size={12} /> : <Download size={12} />}
          </a>
        </div>
      </div>
    </div>
  );
}