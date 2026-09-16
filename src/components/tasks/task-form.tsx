"use client";

import { useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Task, TaskStatus } from "@/lib/types";
import { toDateInputValue } from "@/lib/utils";

export type TaskFormValue = {
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
};

export function TaskForm({
  task,
  onSubmit,
  submitLabel,
}: {
  task?: Task;
  onSubmit: (value: TaskFormValue) => Promise<void>;
  submitLabel: string;
}) {
  const initial = useMemo<TaskFormValue>(
    () => ({
      title: task?.title ?? "",
      description: task?.description ?? "",
      status: task?.status ?? "TODO",
      dueDate: task ? toDateInputValue(task.dueDate) : "",
    }),
    [task],
  );

  const [value, setValue] = useState(initial);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[] | undefined>>({});
  const [submitting, setSubmitting] = useState(false);

  const update = (key: keyof TaskFormValue, next: string) => {
    setValue((current) => ({ ...current, [key]: next }) as TaskFormValue);
    setFieldErrors((current) => ({ ...current, [key]: undefined }));
  };

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setFieldErrors({});
    try {
      await onSubmit(value);
    } catch (error) {
      if (error && typeof error === "object" && "fields" in error) {
        const fields = (error as { fields?: Record<string, string[]> }).fields;
        if (fields) {
          setFieldErrors(fields);
          return;
        }
      }
      toast.error(error instanceof Error ? error.message : "Could not save task");
    } finally {
      setSubmitting(false);
    }
  };

  const input =
    "mt-2 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

  return (
    <form className="space-y-5" onSubmit={submit}>
      <div>
        <label className="text-sm font-semibold text-slate-800" htmlFor="title">
          Task title
        </label>
        <input
          id="title"
          value={value.title}
          onChange={(e) => update("title", e.target.value)}
          className={input}
          placeholder="e.g. Review pull request"
          maxLength={120}
          required
        />
        {fieldErrors.title?.[0] ? (
          <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.title[0]}</p>
        ) : null}
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-800" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          value={value.description}
          onChange={(e) => update("description", e.target.value)}
          className={`${input} min-h-32 resize-y`}
          placeholder="Add enough context to make the next step obvious..."
          maxLength={3000}
          required
        />
        <div className="mt-1.5 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-rose-600">{fieldErrors.description?.[0]}</span>
          <span className="text-xs text-slate-400">{value.description.length}/3000</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-800" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            value={value.status}
            onChange={(e) => update("status", e.target.value)}
            className={input}
          >
            <option value="TODO">To do</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-slate-800" htmlFor="dueDate">
            Due date
          </label>
          <input
            id="dueDate"
            type="date"
            value={value.dueDate}
            onChange={(e) => update("dueDate", e.target.value)}
            className={input}
            required
          />
          {fieldErrors.dueDate?.[0] ? (
            <p className="mt-1.5 text-xs font-medium text-rose-600">{fieldErrors.dueDate[0]}</p>
          ) : null}
        </div>
      </div>

      <div className="flex justify-end pt-1">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {submitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
