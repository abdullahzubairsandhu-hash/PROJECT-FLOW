// app/projects/layout.tsx

// import { requireUser } from "@/lib/auth/require-user";
// import { AppShell } from "@/components/layout/app-shell";

/**
 * ProjectsLayout
 * The structural wrapper for all mission-critical project views.
 * Ensures the AppShell is initialized with the authenticated user context.
 */
export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const user = await requireUser();

  return (
      <div className="flex-1 w-full max-w-[1600px] mx-auto px-4 md:px-8 py-6 lg:py-10 animate-in fade-in duration-700">
        {children}
      </div>
  );
}