// app/api/uploadthing/route.ts

import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // This manually injects the token if the .env lookup fails
  config: {
    token: process.env.UPLOADTHING_TOKEN,
  },
});