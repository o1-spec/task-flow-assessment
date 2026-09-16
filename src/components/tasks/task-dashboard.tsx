"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Circle,
  CircleDot,
  ClipboardCheck,
  ListFilter,
  Plus,
  Search,
  TimerReset,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatCard } from "@/components/tasks/stat-card";
import { TaskCard } from "@/components/tasks/task-card";
import { TaskForm, type TaskFormValue } from "@/components/tasks/task-form";
import type { Task, TaskStatus, TaskSummary } from "@/lib/types";

const emptySummary: TaskSummary = {
  total: 0,
  todo: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
};

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
  const [status, setStatus] = useState<"ALL" | TaskStatus | "OVERDUE">("ALL");
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
      const response = await fetch(`/api/tasks?${query.toString()}`, {
        cache: "no-store",
      });
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
      const response = await fetch(`/api/tasks/${deleting.id}`, {
        method: "DELETE",
      });
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
    if (tasks.length === 1) return "1 task found";
    return `${tasks.length} tasks found`;
  }, [loading, tasks.length]);

  const selectClass =
    "h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100";

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      {/* Header Area */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-slate-200">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">My Tasks</h1>
          <p className="mt-1 text-sm text-slate-500">
            Create, manage, filter, and track all tasks in your workspace.
          </p>
        </div>

        <Button
          size="lg"
          className="bg-slate-950 text-white hover:bg-slate-800 shadow-sm"
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-4 w-4" /> Create Task
        </Button>
      </div>

      {/* Quick Summary Metrics */}
      <section className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Tasks"
          value={summary.total}
          detail="All tasks in workspace"
          icon={CircleDot}
        />
        <StatCard
          label="To Do"
          value={summary.todo}
          detail="Tasks not yet started"
          icon={Circle}
        />
        <StatCard
          label="In Progress"
          value={summary.inProgress}
          detail="Currently being worked on"
          icon={TimerReset}
        />
        <StatCard
          label="Completed"
          value={summary.completed}
          detail="Successfully finished"
          icon={CheckCircle2}
        />
        <StatCard
          label="Overdue"
          value={summary.overdue}
          detail="Passed due date"
          icon={AlertTriangle}
        />
      </section>

      {/* Filter & Search Bar */}
      <section className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-base font-bold tracking-tight text-slate-950">
              Task Directory
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">{filteredLabel}</p>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Search Input */}
            <div className="relative min-w-0 sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-8 text-sm outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="flex gap-2">
              <div className="relative flex-1 sm:flex-none">
                <ListFilter className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={status}
                  onChange={(e) =>
                    setStatus(e.target.value as "ALL" | TaskStatus | "OVERDUE")
                  }
                  className={`${selectClass} w-full pl-9 sm:w-auto`}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="TODO">To Do</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="OVERDUE">Overdue</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className={`${selectClass} flex-1 sm:flex-none`}
              >
                <option value="created-desc">Newest</option>
                <option value="created-asc">Oldest</option>
                <option value="due-asc">Due soon</option>
                <option value="due-desc">Due later</option>
                <option value="title-asc">Title A–Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Cards Grid or Empty States */}
        <div className="mt-6">
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-slate-50"
                />
              ))}
            </div>
          ) : tasks.length ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={setEditing}
                  onDelete={setDeleting}
                />
              ))}
            </div>
          ) : (
            /* Contextual Empty States */
            <div className="grid min-h-64 place-items-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 p-8 text-center">
              <div>
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white text-slate-500 shadow-xs border border-slate-200">
                  <ClipboardCheck className="h-6 w-6" />
                </div>

                {search ? (
                  <>
                    <h3 className="mt-4 font-bold text-slate-900">
                      No tasks match your search
                    </h3>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                      We couldn&apos;t find any tasks matching &quot;{search}&quot;. Try a
                      different keyword.
                    </p>
                    <div className="mt-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSearch("")}
                      >
                        Clear search
                      </Button>
                    </div>
                  </>
                ) : status !== "ALL" ? (
                  <>
                    <h3 className="mt-4 font-bold text-slate-900">
                      {status === "OVERDUE"
                        ? "No overdue tasks"
                        : status === "TODO"
                          ? "No To Do tasks"
                          : status === "IN_PROGRESS"
                            ? "No In Progress tasks"
                            : "No Completed tasks"}
                    </h3>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                      There are currently no tasks with this status filter in your
                      workspace.
                    </p>
                    <div className="mt-4">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setStatus("ALL")}
                      >
                        Show all tasks
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="mt-4 font-bold text-slate-900">
                      Your task list is empty
                    </h3>
                    <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                      Create your first task to start organizing your work and tracking
                      deadlines.
                    </p>
                    <div className="mt-4">
                      <Button
                        size="sm"
                        className="bg-slate-950 text-white"
                        onClick={() => setCreateOpen(true)}
                      >
                        <Plus className="h-4 w-4" /> Create Task
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Create Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a task"
        description="Add the context and due date needed to make this task actionable."
      >
        <TaskForm submitLabel="Create task" onSubmit={createTask} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit task"
        description="Update the task details or move it to a different status."
      >
        {editing ? (
          <TaskForm
            key={editing.id}
            task={editing}
            submitLabel="Save changes"
            onSubmit={updateTask}
          />
        ) : null}
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={Boolean(deleting)}
        onClose={() => !deletingBusy && setDeleting(null)}
        title="Delete task?"
        description="This action permanently removes the task from the workspace. This action cannot be undone."
      >
        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
          <p className="text-sm font-semibold text-slate-900">{deleting?.title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {deleting?.description}
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setDeleting(null)}
            disabled={deletingBusy}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={deleteTask}
            disabled={deletingBusy}
          >
            {deletingBusy ? "Deleting..." : "Delete task"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
