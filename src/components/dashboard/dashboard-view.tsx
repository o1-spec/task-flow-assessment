"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  CircleDot,
  ClipboardList,
  Plus,
  Sparkles,
  TimerReset,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { StatusPill } from "@/components/ui/status-pill";
import { StatCard } from "@/components/tasks/stat-card";
import { TaskForm, type TaskFormValue } from "@/components/tasks/task-form";
import type { SessionUser, Task, TaskSummary } from "@/lib/types";
import { formatDate, isTaskOverdue } from "@/lib/utils";

const emptySummary: TaskSummary = {
  total: 0,
  todo: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
};

export function DashboardView({ user }: { user: SessionUser }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [summary, setSummary] = useState<TaskSummary>(emptySummary);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);

  const [greeting, setGreeting] = useState("Welcome");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  const firstName = user.name.split(" ")[0] || user.name;

  const loadDashboardData = async () => {
    try {
      const res = await fetch("/api/tasks?sort=created-desc", { cache: "no-store" });
      if (!res.ok) throw new Error("Could not load dashboard data");
      const data = await res.json();
      setTasks(data.data || []);
      setSummary(data.summary || emptySummary);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error loading dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadDashboardData();
  }, []);

  const handleCreateTask = async (value: TaskFormValue) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => null);
      throw new Error(data?.message || "Failed to create task");
    }

    setCreateOpen(false);
    toast.success("Task created successfully");
    await loadDashboardData();
  };

  const recentTasks = useMemo(() => {
    return tasks.slice(0, 5);
  }, [tasks]);

  const upcomingDeadlines = useMemo(() => {
    return tasks
      .filter((t) => t.status !== "COMPLETED")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [tasks]);

  const completionRate = useMemo(() => {
    if (!summary.total) return 0;
    return Math.round((summary.completed / summary.total) * 100);
  }, [summary.completed, summary.total]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <section className="relative overflow-hidden rounded-3xl bg-[#0f172a] px-6 py-7 text-white shadow-soft sm:px-8 sm:py-8">
        <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-cyan-400/10 blur-3xl" />

        <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" /> Workspace Overview
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              {greeting}, {firstName}
            </h1>
            <p className="mt-2 text-sm text-slate-300 sm:text-base">
              Here is what is happening across your tasks today.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/tasks">
              <Button
                variant="ghost"
                size="lg"
                className="text-slate-300 hover:bg-white/10 hover:text-white border border-white/10"
              >
                <ClipboardList className="h-4 w-4" /> View all tasks
              </Button>
            </Link>
            <Button
              size="lg"
              className="bg-white text-slate-950 hover:bg-slate-100 shadow-md"
              onClick={() => setCreateOpen(true)}
            >
              <Plus className="h-4 w-4" /> New task
            </Button>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 grid-cols-2 lg:grid-cols-5">
        <StatCard
          label="Total Tasks"
          value={summary.total}
          detail="All active & completed"
          icon={CircleDot}
        />
        <StatCard
          label="To Do"
          value={summary.todo}
          detail="Awaiting start"
          icon={Circle}
        />
        <StatCard
          label="In Progress"
          value={summary.inProgress}
          detail="Under active development"
          icon={TimerReset}
        />
        <StatCard
          label="Completed"
          value={summary.completed}
          detail="Finished tasks"
          icon={CheckCircle2}
        />
        <StatCard
          label="Overdue"
          value={summary.overdue}
          detail="Past due date"
          icon={AlertTriangle}
        />
      </section>

      {/* Task Progress Bar */}
      <section className="mt-6 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-slate-900">Task Completion Progress</h2>
            <p className="text-xs text-slate-500">
              {summary.completed} of {summary.total} tasks completed ({completionRate}%)
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 sm:text-right">
            {summary.total > 0 && summary.completed === summary.total
              ? "All tasks completed! 🎉"
              : `${summary.total - summary.completed} tasks remaining`}
          </span>
        </div>

        <div className="mt-3.5 h-3 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-500 ease-out"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Tasks</h2>
              <p className="text-xs text-slate-500">Latest additions to your workspace</p>
            </div>
            <Link
              href="/tasks"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              View all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-3 divide-y divide-slate-100 flex-1">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading recent tasks...</div>
            ) : recentTasks.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-500">No tasks created yet.</p>
                <button
                  type="button"
                  onClick={() => setCreateOpen(true)}
                  className="mt-2 text-xs font-semibold text-indigo-600 hover:underline"
                >
                  Create your first task
                </button>
              </div>
            ) : (
              recentTasks.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="group flex items-center justify-between py-3 transition hover:bg-slate-50/80 -mx-2 px-2 rounded-xl"
                >
                  <div className="min-w-0 flex-1 pr-3">
                    <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition">
                      {task.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <StatusPill status={task.status} />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs flex flex-col">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Upcoming Deadlines</h2>
              <p className="text-xs text-slate-500">Tasks requiring your attention soonest</p>
            </div>
            <Link
              href="/tasks?sort=due-asc"
              className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition"
            >
              Sorted by due date <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="mt-3 divide-y divide-slate-100 flex-1">
            {loading ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading deadlines...</div>
            ) : upcomingDeadlines.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-xs text-slate-500">No upcoming pending deadlines.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">All tasks are up to date.</p>
              </div>
            ) : (
              upcomingDeadlines.map((task) => {
                const overdue = isTaskOverdue(task.dueDate, task.status);
                return (
                  <Link
                    key={task.id}
                    href={`/tasks/${task.id}`}
                    className="group flex items-center justify-between py-3 transition hover:bg-slate-50/80 -mx-2 px-2 rounded-xl"
                  >
                    <div className="min-w-0 flex-1 pr-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-900 truncate group-hover:text-indigo-600 transition">
                          {task.title}
                        </p>
                        {overdue && (
                          <span className="rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 shrink-0">
                            Overdue
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                        <CalendarDays className="h-3.5 w-3.5" />
                        <span>Due {formatDate(task.dueDate)}</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <StatusPill status={task.status} />
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </section>

      {/* Create Task Modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Create a task"
        description="Add the details, status, and due date needed to organize this task."
      >
        <TaskForm submitLabel="Create task" onSubmit={handleCreateTask} />
      </Modal>
    </div>
  );
}
