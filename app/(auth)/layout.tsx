// app/(auth)/layout.tsx

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full bg-zinc-950">
      {/* 1. Subtle Engineering Grid Background */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* 2. Top-Right System Status (Purely Aesthetic) */}
      <div className="absolute top-8 right-8 items-center gap-4 z-10 hidden md:flex">
        <div className="flex flex-col items-end">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600">
            Secure Node: PF-ALPHA-01
          </span>
          <span className="text-[9px] font-medium text-emerald-500/60 uppercase tracking-widest">
            System Status: Nominal
          </span>
        </div>
        <div className="h-8 w-[1px] bg-white/10" />
      </div>

      {/* 3. The Content Area */}
      <main className="relative z-10 flex min-h-screen w-full flex-col">
        {children}
      </main>

      {/* 4. Bottom-Left Footer Attribution */}
      <div className="absolute bottom-8 left-8 z-10 hidden md:block">
        <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-zinc-700">
          © 2026 ProjectFlow Systems / v2.0.4-STABLE
        </p>
      </div>
    </div>
  );
}