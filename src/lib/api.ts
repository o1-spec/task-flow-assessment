import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function apiError(error: unknown) {
  if (error instanceof SyntaxError) {
    return NextResponse.json(
      {
        error: "INVALID_JSON",
        message: "The request body must contain valid JSON.",
      },
      { status: 400 },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: "VALIDATION_ERROR",
        message: "Please review the submitted fields.",
        fields: error.flatten().fieldErrors,
      },
      { status: 400 },
    );
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return NextResponse.json(
        {
          error: "CONFLICT",
          message: "An account with this email address already exists.",
        },
        { status: 409 },
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        {
          error: "NOT_FOUND",
          message: "The requested resource was not found.",
        },
        { status: 404 },
      );
    }
  }

  console.error("Internal server error:", error);
  return NextResponse.json(
    {
      error: "INTERNAL_SERVER_ERROR",
      message: "Something went wrong. Please try again.",
    },
    { status: 500 },
  );
}

export function unauthorizedResponse(message = "Authentication required.") {
  return NextResponse.json(
    {
      error: "UNAUTHORIZED",
      message,
    },
    { status: 401 },
  );
}
