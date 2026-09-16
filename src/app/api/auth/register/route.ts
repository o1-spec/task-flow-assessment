import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { createSessionToken, hashPassword, setSessionCookie } from "@/lib/auth";
import { registerSchema } from "@/lib/auth-validation";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = registerSchema.parse(await request.json());

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          error: "CONFLICT",
          message: "An account with this email address already exists.",
        },
        { status: 409 },
      );
    }

    const passwordHash = await hashPassword(body.password);

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        passwordHash,
      },
    });

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = await createSessionToken(sessionUser, false);
    await setSessionCookie(token, false);

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: sessionUser,
      },
      { status: 201 },
    );
  } catch (error) {
    return apiError(error);
  }
}
