"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  ClipboardCheck,
  ListFilter,
  Plus,
  Search,
  TimerReset,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatCard } from "@/components/tasks/stat-card";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskForm, type TaskFormValue } from "@/components/tasks/task-form";
import type { Task, TaskStatus, TaskSummary } from "@/lib/types";

const emptySummary: TaskSummary = { total: 0, todo: 0, inProgress: 0, completed: 0, overdue: 0 };

async function readError(response: Response) {
  const body = await response.json().catch(() => null);
  const error = new Error(body?.message ?? "Request failed") as Error & {
    fields?: Record<string, string[]>;
  };
  error.fields = body?.fields;
  return error;
}

export function TaskDashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<TaskSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<"ALL" | TaskStatus>("ALL");
  const [sort, setSort] = useState("created-desc");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timer);
  }, [search]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams({ status, sort });
      if (debouncedSearch) query.set("search", debouncedSearch);
      const response = await fetch(`/api/tasks?${query.toString()}`, { cache: "no-store" });
      if (!response.ok) throw await readError(response);
      const body = await response.json();
      setTasks(body.data);
      setSummary(body.summary);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not load tasks");
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, status, sort]);

  useEffect(() => {
    void loadTasks();
  }, [loadTasks]);

  const createTask = async (value: TaskFormValue) => {
    const response = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) throw await readError(response);
    setCreateOpen(false);
    toast.success("Task created");
    await loadTasks();
  };

  const updateTask = async (value: TaskFormValue) => {
    if (!editing) return;
    const response = await fetch(`/api/tasks/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) throw await readError(response);
    setEditing(null);
    toast.success("Task updated");
    await loadTasks();
  };

  const deleteTask = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      const response = await fetch(`/api/tasks/${deleting.id}`, { method: "DELETE" });
      if (!response.ok) throw await readError(response);
      setDeleting(null);
      toast.success("Task deleted");
      await loadTasks();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete task");
    } finally {
      setDeletingBusy(false);
    }
  };

  const filteredLabel = useMemo(() => {
    if (loading) return "Loading your tasks...";
    if (tasks.length === 1) return "1 task matches your filters";
    return `${tasks.length} tasks match your filters`;
  }, [loading, tasks.length]);

  const selectClass =
    "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <section className="relative overflow-hidden rounded-3xl bg-[#111827] px-6 py-7 text-white shadow-soft sm:px-8 sm:py-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />
        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-300">
              <ClipboardCheck className="h-3.5 w-3.5" /> Task workspace
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-[-0.04em] sm:text-4xl">Keep work moving without the clutter.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-[15px]">
              Create, prioritise, update, and finish tasks from one focused workspace.
            </p>
          </div>
          <Button
            size="lg"
            className="bg-white text-slate-950 hover:bg-slate-100 focus-visible:ring-white/40"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4" /> New task
          </Button>
        </div>
      </section>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="All tasks" value={summary.total} detail="Everything in your workspace" icon={CircleDot} />
        <StatCard label="In progress" value={summary.inProgress} detail="Currently being worked on" icon={TimerReset} />
        <StatCard label="Completed" value={summary.completed} detail="Closed and completed tasks" icon={CheckCircle2} />
        <StatCard label="Overdue" value={summary.overdue} detail="Open tasks past their due date" icon={AlertTriangle} />
      </section>

      <section id="tasks" className="mt-7 scroll-mt-20 rounded-3xl border border-slate-200/90 bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.02)] sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-950">Your tasks</h2>
            <p className="mt-1 text-sm text-slate-500">{filteredLabel}</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <label className="relative block min-w-0 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none">
                <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "ALL" | TaskStatus)}
                  className={`${selectClass} w-full pl-9 sm:w-auto`}
                >
                  <option value="ALL">All statuses</option>
                  <option value="TODO">To do</option>
                  <option value="IN_PROGRESS">In progress</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </div>
              <select value={sort} onChange={(e) => setSort(e.target.value)} className={`${selectClass} flex-1 sm:flex-none`}>
                <option value="created-desc">Newest</option>
                <option value="due-asc">Due soon</option>
                <option value="due-desc">Due later</option>
                <option value="title-asc">Title A–Z</option>
              </select>
            </div>
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-slate-50" />
              ))}
            </div>
          ) : tasks.length ? (
            <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={setEditing} onDelete={setDeleting} />
              ))}
            </div>
          ) : (
            <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
              <div>
                <div className="mx-auto grid h-11 w-11 place-items-center rounded-2xl bg-white text-slate-500 shadow-sm">
                  <ClipboardCheck className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-bold text-slate-900">No tasks found</h3>
                <p className="mt-1 max-w-sm text-sm leading-6 text-slate-500">
                  Try changing your search or filters, or create a new task to get started.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a task"
        description="Add the context and due date needed to make this task actionable."
      >
        <TaskForm submitLabel="Create task" onSubmit={createTask} />
      </Modal>

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit task"
        description="Update the task details or move it to a different status."
      >
        {editing ? <TaskForm key={editing.id} task={editing} submitLabel="Save changes" onSubmit={updateTask} /> : null}
      </Modal>

      <Modal
        open={Boolean(deleting)}
        onClose={() => !deletingBusy && setDeleting(null)}
        title="Delete task?"
        description="This permanently removes the task from the workspace. This action cannot be undone."
      >
        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
          <p className="text-sm font-semibold text-slate-900">{deleting?.title}</p>
          <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-500">{deleting?.description}</p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleting(null)} disabled={deletingBusy}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteTask} disabled={deletingBusy}>
            {deletingBusy ? "Deleting..." : "Delete task"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
