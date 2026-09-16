import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Clock3 } from "lucide-react";
import { TaskDetailActions } from "@/components/tasks/task-detail-actions";
import { StatusPill } from "@/components/ui/status-pill";
import { prisma } from "@/lib/prisma";
import type { Task } from "@/lib/types";
import { formatDate, isTaskOverdue } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TaskDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const record = await prisma.task.findUnique({ where: { id } });
  if (!record) notFound();

  const task: Task = {
    ...record,
    dueDate: record.dueDate.toISOString(),
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };

  const overdue = isTaskOverdue(task.dueDate, task.status);

  return (
    <div className="mx-auto max-w-5xl px-4 py-7 sm:px-6 lg:px-8 lg:py-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950">
        <ArrowLeft className="h-4 w-4" /> Back to all tasks
      </Link>

      <article className="mt-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-100 bg-gradient-to-br from-white to-slate-50 px-6 py-7 sm:px-8 sm:py-9">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill status={task.status} />
                {overdue ? <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">Overdue</span> : null}
              </div>
              <h1 className="mt-4 text-3xl font-bold tracking-[-0.035em] text-slate-950 sm:text-4xl">{task.title}</h1>
            </div>
            <TaskDetailActions task={task} />
          </div>
        </div>

        <div className="grid gap-8 px-6 py-7 sm:px-8 sm:py-9 lg:grid-cols-[1fr_260px]">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.14em] text-slate-400">Description</h2>
            <p className="mt-4 whitespace-pre-wrap text-[15px] leading-7 text-slate-700">{task.description}</p>
          </div>
          <aside className="space-y-3">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                <CalendarDays className="h-4 w-4" /> Due date
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(task.dueDate)}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                <Clock3 className="h-4 w-4" /> Created
              </div>
              <p className="mt-2 text-sm font-semibold text-slate-900">{formatDate(task.createdAt)}</p>
            </div>
          </aside>
        </div>
      </article>
    </div>
  );
}
