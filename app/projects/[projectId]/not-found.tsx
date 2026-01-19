// app/projects/[projectId]/not-found.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { AlertTriangle, ArrowLeft } from "lucide-react";

export default function ProjectNotFound() {
  return (
    <div className="flex items-center justify-center min-h-[80vh] p-4 animate-in fade-in duration-1000">
      <Card className="w-full max-w-md border-white/5 bg-zinc-950 shadow-2xl overflow-hidden relative">
        {/* Subtle red ambient pulse for error state */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent" />
        
        <CardHeader className="space-y-6 pt-10">
          <div className="w-14 h-14 mx-auto rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 text-red-500/80" />
          </div>
          
          <div className="space-y-2 text-center">
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/60 mb-2">
              Error_Code: 404_NOT_FOUND
            </h1>
            <CardTitle className="text-2xl font-black uppercase tracking-widest text-zinc-100 italic">
              Project_Not_Resolved
            </CardTitle>
            <CardDescription className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
              The requested node does not exist or access privileges have been revoked.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pb-10 pt-4">
          <Link href="/dashboard" className="block">
            <Button 
              variant="outline" 
              className="w-full border-white/5 bg-zinc-900/50 hover:bg-zinc-800 text-[11px] font-black uppercase tracking-widest h-12 group"
            >
              <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
              Return_to_Dashboard
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}