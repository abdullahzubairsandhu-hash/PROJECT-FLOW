// app/api/resources/[resourceId]/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";

export async function DELETE(
  _req: Request, // Prefixed with _ to satisfy unused variable rule
  { params }: { params: { resourceId: string } }
) {
  try {
    await requireUser();
    
    await prisma.resource.delete({
      where: { id: params.resourceId },
    });
    
    return new NextResponse("DELETED", { status: 200 });
  } catch {
    // Removed the (error) variable since it wasn't being used
    return new NextResponse("DELETE_FAILED", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { resourceId: string } }
) {
  try {
    await requireUser();
    const body = await req.json();
    
    const resource = await prisma.resource.update({
      where: { id: params.resourceId },
      data: { 
        title: body.title,
        description: body.description,
        url: body.url,
        type: body.type,
      },
    });
    
    return NextResponse.json(resource);
  } catch {
    // Removed the (error) variable since it wasn't being used
    return new NextResponse("UPDATE_FAILED", { status: 500 });
  }
}