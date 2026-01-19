// app/projects/error.tsx

"use client";

import { useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCcw } from "lucide-react";

interface ProjectsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ProjectsError({ error, reset }: ProjectsErrorProps) {
  useEffect(() => {
    // Log to a monitoring service in production
    console.error("CRITICAL_SYSTEM_ERROR:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-[70vh] p-4 animate-in fade-in duration-1000">
      <Card className="w-full max-w-md border-red-500/20 bg-zinc-950 shadow-2xl relative overflow-hidden">
        {/* Error State Indicator Line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-red-500/50" />
        
        <CardHeader className="space-y-6 pt-10">
          <div className="w-14 h-14 mx-auto rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-red-500/80" />
          </div>
          
          <div className="space-y-2 text-center">
            <h1 className="text-[10px] font-black uppercase tracking-[0.4em] text-red-500/60 mb-2">
              Status_Critical: Fetch_Failure
            </h1>
            <CardTitle className="text-2xl font-black uppercase tracking-widest text-zinc-100 italic">
              Data_Corruption
            </CardTitle>
            <CardDescription className="text-[11px] font-medium uppercase tracking-widest text-zinc-500 leading-relaxed max-w-[280px] mx-auto">
              The project registry could not be initialized. Terminal connection interrupted.
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pb-10">
          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/10 font-mono text-[10px] text-red-400/80 break-all leading-tight">
            <span className="text-red-500/40 mr-2 uppercase">Error_Log:</span>
            {error.message || "UNIDENTIFIED_EXCEPTION_OCCURRED"}
            {error.digest && (
              <div className="mt-2 text-red-500/40">DIGEST_ID: {error.digest}</div>
            )}
          </div>

          <Button 
            onClick={reset} 
            variant="outline"
            className="w-full border-red-500/20 bg-zinc-900/50 hover:bg-red-500/10 text-red-500 text-[11px] font-black uppercase tracking-widest h-12 group transition-all"
          >
            <RefreshCcw className="mr-2 h-3.5 w-3.5 transition-transform group-hover:rotate-180 duration-500" />
            Reinitialize_Session
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}