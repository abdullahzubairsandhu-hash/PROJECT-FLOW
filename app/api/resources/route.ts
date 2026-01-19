// app/api/resources/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";

export async function POST(req: Request) {
  try {
    const user = await requireUser();
    const body = await req.json();
    const { title, description, url, type } = body;

    if (!title || !url) {
      return new NextResponse("MISSING_REQUIRED_FIELDS", { status: 400 });
    }

    const resource = await prisma.resource.create({
      data: {
        title,
        description: description || "",
        url,
        type: type || "LINK",
        creatorId: user.id, // Links the resource to the person who added it
      },
    });

    return NextResponse.json(resource);
  } catch (error) {
    console.error("[RESOURCE_POST]", error);
    return new NextResponse("DATABASE_SYNC_ERROR", { status: 500 });
  }
}