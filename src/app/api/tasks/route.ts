import { Prisma, TaskStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { apiError, unauthorizedResponse } from "@/lib/api";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { taskCreateSchema } from "@/lib/task-validation";

const allowedStatuses = new Set<string>(["TODO", "IN_PROGRESS", "COMPLETED", "OVERDUE"]);
const allowedSorts = new Set(["created-desc", "created-asc", "due-asc", "due-desc", "title-asc"]);

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim() ?? "";
    const statusParam = searchParams.get("status") ?? "ALL";
    const sort = allowedSorts.has(searchParams.get("sort") ?? "")
      ? (searchParams.get("sort") as string)
      : "created-desc";

    const todayUtc = new Date();
    todayUtc.setUTCHours(0, 0, 0, 0);

    const where: Prisma.TaskWhereInput = {
      userId: session.id,
      ...(search
        ? {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(statusParam === "OVERDUE"
        ? {
            dueDate: { lt: todayUtc },
            status: { not: "COMPLETED" },
          }
        : allowedStatuses.has(statusParam) && statusParam !== "OVERDUE"
          ? { status: statusParam as TaskStatus }
          : {}),
    };

    const orderBy: Prisma.TaskOrderByWithRelationInput =
      sort === "due-asc"
        ? { dueDate: "asc" }
        : sort === "due-desc"
          ? { dueDate: "desc" }
          : sort === "title-asc"
            ? { title: "asc" }
            : sort === "created-asc"
              ? { createdAt: "asc" }
              : { createdAt: "desc" };

    const [tasks, total, todo, inProgress, completed, overdue] = await prisma.$transaction([
      prisma.task.findMany({ where, orderBy }),
      prisma.task.count({ where: { userId: session.id } }),
      prisma.task.count({ where: { userId: session.id, status: "TODO" } }),
      prisma.task.count({ where: { userId: session.id, status: "IN_PROGRESS" } }),
      prisma.task.count({ where: { userId: session.id, status: "COMPLETED" } }),
      prisma.task.count({
        where: {
          userId: session.id,
          dueDate: { lt: todayUtc },
          status: { not: "COMPLETED" },
        },
      }),
    ]);

    return NextResponse.json({
      data: tasks,
      meta: { count: tasks.length },
      summary: { total, todo, inProgress, completed, overdue },
    });
  } catch (error) {
    return apiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return unauthorizedResponse();
    }

    const body = taskCreateSchema.parse(await request.json());

    const task = await prisma.task.create({
      data: {
        ...body,
        userId: session.id,
        dueDate: new Date(`${body.dueDate}T00:00:00.000Z`),
      },
    });

    return NextResponse.json({ data: task }, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}
