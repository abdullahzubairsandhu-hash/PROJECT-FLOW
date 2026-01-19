// app/api/uploadthing/core.ts

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  vaultAsset: f({ 
    image: { maxFileSize: "4MB" },
    pdf: { maxFileSize: "16MB" },
    text: { maxFileSize: "4MB" },
    blob: { maxFileSize: "32MB" } 
  })
    .middleware(async () => {
      // CRITICAL: You MUST await auth() in Next.js 15
      const { userId } = await auth(); 
      
      if (!userId) throw new Error("Unauthorized");
      
      // The return value here is passed to onUploadComplete as "metadata"
      return { userId }; 
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;