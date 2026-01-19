// app/page.tsx

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

/**
 * Root Router
 * Handlers the initial entry point of the application.
 * Performs a server-side handshake to determine the session state
 * and routes to the appropriate operational environment.
 */
export default async function HomePage() {
  const { userId } = await auth();

  // Protocol: Direct routing to prevent layout shift or flash of unauthenticated state.
  if (userId) {
    redirect("/dashboard");
  }

  redirect("/sign-in");
}