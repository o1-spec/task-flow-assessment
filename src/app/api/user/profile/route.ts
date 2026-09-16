import { NextRequest, NextResponse } from "next/server";
import { apiError, unauthorizedResponse } from "@/lib/api";
import { createSessionToken, getSession, setSessionCookie } from "@/lib/auth";
import { updateProfileSchema } from "@/lib/auth-validation";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return unauthorizedResponse();

  const user = await prisma.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      _count: {
        select: { tasks: true },
      },
    },
  });

  if (!user) return unauthorizedResponse("User not found");

  return NextResponse.json({
    user: {
      ...user,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    },
  });
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    const body = updateProfileSchema.parse(await request.json());

    if (body.email !== session.email) {
      const existing = await prisma.user.findUnique({
        where: { email: body.email },
      });
      if (existing && existing.id !== session.id) {
        return NextResponse.json(
          {
            error: "CONFLICT",
            message: "An account with this email address already exists.",
          },
          { status: 409 },
        );
      }
    }

    const updated = await prisma.user.update({
      where: { id: session.id },
      data: {
        name: body.name,
        email: body.email,
      },
    });

    // Refresh session cookie with new name/email
    const token = await createSessionToken({
      id: updated.id,
      email: updated.email,
      name: updated.name,
    });
    await setSessionCookie(token);

    return NextResponse.json({
      message: "Profile updated successfully.",
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
      },
    });
  } catch (error) {
    return apiError(error);
  }
}
