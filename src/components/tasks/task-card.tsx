"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusPill } from "@/components/ui/status-pill";
import type { Task } from "@/lib/types";
import { cn, formatDate, isTaskOverdue } from "@/lib/utils";

export function TaskCard({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  const overdue = isTaskOverdue(task.dueDate, task.status);

  return (
    <article className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusPill status={task.status} />
            {overdue ? (
              <span className="rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700">
                Overdue
              </span>
            ) : null}
          </div>
          <Link href={`/tasks/${task.id}`} className="block">
            <h3 className="truncate text-[17px] font-bold tracking-tight text-slate-950 group-hover:text-indigo-700">
              {task.title}
            </h3>
            <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">{task.description}</p>
          </Link>
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 px-0"
            onClick={() => onEdit(task)}
            aria-label={`Edit ${task.title}`}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-9 w-9 px-0 text-slate-500 hover:bg-rose-50 hover:text-rose-700"
            onClick={() => onDelete(task)}
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
        <div className={cn("flex items-center gap-2 text-xs font-medium", overdue ? "text-rose-600" : "text-slate-500")}>
          <CalendarDays className="h-4 w-4" />
          Due {formatDate(task.dueDate)}
        </div>
        <Link
          href={`/tasks/${task.id}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 transition hover:text-slate-950"
        >
          View task <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
