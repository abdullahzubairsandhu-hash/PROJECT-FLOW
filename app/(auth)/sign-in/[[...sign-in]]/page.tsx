// app/(auth)/sign-in/[[...sign-in]]/page.tsx

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-zinc-950 px-4 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-md z-10">
        <div className="text-center space-y-3 mb-12 animate-in fade-in slide-in-from-top-8 duration-1000">
          <div className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/5 px-3 py-1 mb-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">
              System Access Restricted
            </span>
          </div>
          <h1 className="text-3xl font-black uppercase tracking-[0.3em] text-zinc-100 italic">
            ProjectFlow
          </h1>
          <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
            Authentication Required to Initialize Session
          </p>
        </div>

        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
          <SignIn
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                // Increased contrast: darker card, brighter border
                card: "bg-zinc-950 border border-emerald-500/20 shadow-[0_0_50px_-12px_rgba(16,185,129,0.15)] backdrop-blur-3xl rounded-2xl",
                headerTitle: "text-zinc-50 font-black uppercase tracking-[0.2em] text-lg",
                headerSubtitle: "text-zinc-400 text-[11px] font-medium leading-relaxed",
                // Brighter buttons for better interaction
                socialButtonsBlockButton: "bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-200 transition-all duration-300",
                socialButtonsBlockButtonText: "font-bold tracking-tight",
                // Primary Button: High Contrast emerald gradient
                formButtonPrimary: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-[11px] font-black uppercase tracking-[0.2em] h-11 transition-all shadow-[0_10px_20px_-10px_rgba(16,185,129,0.3)]",
                formFieldLabel: "text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-2",
                formFieldInput: "bg-zinc-900/80 border-white/10 text-white focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all h-11",
                footerActionText: "text-zinc-400 text-[11px]",
                footerActionLink: "text-emerald-400 hover:text-emerald-300 font-bold underline decoration-emerald-500/30 underline-offset-4",
                identityPreviewText: "text-zinc-100 font-bold",
                formResendCodeLink: "text-emerald-400 font-bold",
                dividerRow: "opacity-20",
                dividerText: "text-zinc-500 text-[9px] uppercase font-black",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}