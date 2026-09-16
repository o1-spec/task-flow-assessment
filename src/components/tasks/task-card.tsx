"use client";

import Link from "next/link";
import { CalendarDays, ChevronRight, Clock, Pencil, Trash2 } from "lucide-react";
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
    <article className="group rounded-2xl border border-slate-200/90 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.02)] transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill status={task.status} />
            {overdue && (
              <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700">
                Overdue
              </span>
            )}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 px-0 text-slate-500 hover:text-slate-900"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 px-0 text-slate-400 hover:bg-rose-50 hover:text-rose-700"
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="mt-3">
          <Link href={`/tasks/${task.id}`} className="block group-hover:text-indigo-600 transition">
            <h3 className="text-[16px] font-bold tracking-tight text-slate-950 truncate">
              {task.title}
            </h3>
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
              {task.description}
            </p>
          </Link>
        </div>
      </div>

      <div className="mt-5 border-t border-slate-100 pt-3.5 flex items-center justify-between text-xs">
        <div className="flex flex-col gap-1">
          <div
            className={cn(
              "flex items-center gap-1.5 font-medium",
              overdue ? "text-rose-600 font-semibold" : "text-slate-600",
            )}
          >
            <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
            <span>Due {formatDate(task.dueDate)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
            <Clock className="h-3 w-3" />
            <span>Created {formatDate(task.createdAt)}</span>
          </div>
        </div>

        <Link
          href={`/tasks/${task.id}`}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-950 transition"
        >
          View <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
