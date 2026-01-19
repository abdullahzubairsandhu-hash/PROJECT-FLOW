// app/api/projects/[projectId]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const user = await requireUser();
    const { projectId } = await params;
    
    // Parse the incoming form data
    const body = await req.json();
    const { name, description } = body;

    // 1. Verify that the project exists and the user is the owner
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
      select: { ownerId: true }
    });

    if (!existingProject) {
      return new NextResponse("PROJECT_NOT_FOUND", { status: 404 });
    }

    if (existingProject.ownerId !== user.id) {
      return new NextResponse("UNAUTHORIZED_ACCESS", { status: 403 });
    }

    // 2. Perform the update
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: {
        name,
        description,
      },
    });

    // 3. Return the updated data to trigger the modal's success logic
    return NextResponse.json(updatedProject);
  } catch {
    return new NextResponse("INTERNAL_SERVER_ERROR", { status: 500 });
  }
}