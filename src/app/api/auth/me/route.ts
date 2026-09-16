import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { unauthorizedResponse } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return unauthorizedResponse("You must be logged in to view your profile.");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    return unauthorizedResponse("User account does not exist.");
  }

  return NextResponse.json({
    user: {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
  });
}
