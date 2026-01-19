// middleware.ts

import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Define which routes don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)', 
  '/sign-up(.*)',
  '/api/uploadthing(.*)' // Allows UploadThing to verify tokens without being blocked by Clerk
]);

export default clerkMiddleware(async (auth, request) => {
  // 2. Fix: Actually USE the isPublicRoute variable here
  if (!isPublicRoute(request)) {
    // This protects all routes EXCEPT the ones defined above
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};