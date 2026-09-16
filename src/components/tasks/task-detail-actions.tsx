"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2, Pencil, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TaskForm, type TaskFormValue } from "@/components/tasks/task-form";
import type { Task } from "@/lib/types";

async function getError(response: Response) {
  const body = await response.json().catch(() => null);
  const error = new Error(body?.message ?? "Request failed") as Error & {
    fields?: Record<string, string[]>;
  };
  error.fields = body?.fields;
  return error;
}

export function TaskDetailActions({ task }: { task: Task }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [togglingStatus, setTogglingStatus] = useState(false);

  const toggleComplete = async () => {
    setTogglingStatus(true);
    try {
      const nextStatus = task.status === "COMPLETED" ? "TODO" : "COMPLETED";
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw await getError(res);
      toast.success(
        nextStatus === "COMPLETED"
          ? "Task marked as completed"
          : "Task marked as to do",
      );
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not update status");
    } finally {
      setTogglingStatus(false);
    }
  };

  const update = async (value: TaskFormValue) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
    if (!response.ok) throw await getError(response);
    setEditOpen(false);
    toast.success("Task updated");
    router.refresh();
  };

  const remove = async () => {
    setDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, { method: "DELETE" });
      if (!response.ok) throw await getError(response);
      toast.success("Task deleted");
      router.push("/tasks");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete task");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {task.status === "COMPLETED" ? (
          <Button
            variant="secondary"
            onClick={toggleComplete}
            disabled={togglingStatus}
            className="text-slate-700 hover:text-slate-950"
          >
            {togglingStatus ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RotateCcw className="h-4 w-4 text-slate-500" />
            )}
            Reopen task
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={toggleComplete}
            disabled={togglingStatus}
            className="border-emerald-200 bg-emerald-50/60 text-emerald-800 hover:bg-emerald-100 hover:text-emerald-900"
          >
            {togglingStatus ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            )}
            Mark Complete
          </Button>
        )}

        <Button variant="secondary" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" /> Edit
        </Button>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Edit task"
        description="Update the details, due date, or current status."
      >
        <TaskForm task={task} submitLabel="Save changes" onSubmit={update} />
      </Modal>

      <Modal
        open={deleteOpen}
        onClose={() => !deleting && setDeleteOpen(false)}
        title="Delete task?"
        description="This action permanently removes the task from your workspace and cannot be undone."
      >
        <div className="rounded-2xl border border-rose-100 bg-rose-50/60 p-4 mb-6">
          <p className="text-sm font-semibold text-slate-900">{task.title}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {task.description}
          </p>
        </div>
        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            onClick={() => setDeleteOpen(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={remove} disabled={deleting}>
            {deleting ? "Deleting..." : "Delete task"}
          </Button>
        </div>
      </Modal>
    </>
  );
}
