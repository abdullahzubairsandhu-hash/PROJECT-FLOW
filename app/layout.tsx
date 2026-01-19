// app/layout.tsx

// app/layout.tsx

import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";
import { AppShell } from "@/components/layout/app-shell";
import { getCurrentUser } from "@/lib/auth/get-current-user";
import { getUnreadNotifications } from "@/lib/notifications/notification-queries";

// UploadThing Imports
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "PROJECTFLOW // COMMAND",
  description: "High-performance project orchestration and manifest tracking.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch global data here
  const user = await getCurrentUser();
  const notifications = user ? await getUnreadNotifications(user.id) : [];

  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#10b981",
          colorBackground: "#09090b",
          colorText: "#f4f4f5",
          colorTextSecondary: "#a1a1aa",
        }
      }}
    >
      <html lang="en" suppressHydrationWarning className="selection:bg-emerald-500/30">
        <body className={`${inter.variable} ${mono.variable} font-sans bg-zinc-950 text-zinc-100 antialiased min-h-screen overflow-x-hidden`}>
          {/* Synchronizes UploadThing router config to the client */}
          <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
          
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            {user ? (
              <AppShell user={user} notifications={notifications}>
                {children}
              </AppShell>
            ) : (
              children
            )}
            {/* Renders toast notifications */}
            <Toaster position="bottom-right" theme="dark" />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}