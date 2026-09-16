import { NextRequest, NextResponse } from "next/server";
import { apiError } from "@/lib/api";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";
import { loginSchema } from "@/lib/auth-validation";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = loginSchema.parse(await request.json());

    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    const passwordsMatch = await verifyPassword(body.password, user.passwordHash);
    if (!passwordsMatch) {
      return NextResponse.json(
        {
          error: "INVALID_CREDENTIALS",
          message: "Invalid email or password.",
        },
        { status: 401 },
      );
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
    };

    const token = await createSessionToken(sessionUser, body.rememberMe);
    await setSessionCookie(token, body.rememberMe);

    return NextResponse.json({
      message: "Logged in successfully.",
      user: sessionUser,
    });
  } catch (error) {
    return apiError(error);
  }
}
