import { NextRequest, NextResponse } from "next/server";
import { apiError, unauthorizedResponse } from "@/lib/api";
import { getSession, hashPassword, verifyPassword } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/auth-validation";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorizedResponse();

    const body = changePasswordSchema.parse(await request.json());

    const user = await prisma.user.findUnique({
      where: { id: session.id },
    });

    if (!user) return unauthorizedResponse("User not found");

    const match = await verifyPassword(body.currentPassword, user.passwordHash);
    if (!match) {
      return NextResponse.json(
        {
          error: "INVALID_CREDENTIALS",
          message: "Current password does not match.",
        },
        { status: 400 },
      );
    }

    const newHash = await hashPassword(body.newPassword);
    await prisma.user.update({
      where: { id: session.id },
      data: { passwordHash: newHash },
    });

    return NextResponse.json({ message: "Password updated successfully." });
  } catch (error) {
    return apiError(error);
  }
}
