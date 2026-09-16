import { NextRequest, NextResponse } from "next/server";
import { apiError, unauthorizedResponse } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { taskUpdateSchema } from "@/lib/task-validation";

type Context = { params: Promise<{ id: string }> };

export async function GET(_: NextRequest, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;
    const task = await prisma.task.findFirst({
      where: {
        id,
        userId: session.id,
      },
    });

    if (!task) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Task not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({ data: task });
  } catch (error) {
    return apiError(error);
  }
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;
    const body = taskUpdateSchema.parse(await request.json());

    // Verify task exists and belongs to this user
    const existing = await prisma.task.findFirst({
      where: { id, userId: session.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Task not found." },
        { status: 404 },
      );
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...body,
        ...(body.dueDate
          ? { dueDate: new Date(`${body.dueDate}T00:00:00.000Z`) }
          : {}),
      },
    });

    return NextResponse.json({ data: task });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(_: NextRequest, context: Context) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const { id } = await context.params;

    // Verify task exists and belongs to this user
    const existing = await prisma.task.findFirst({
      where: { id, userId: session.id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "NOT_FOUND", message: "Task not found." },
        { status: 404 },
      );
    }

    await prisma.task.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return apiError(error);
  }
}
