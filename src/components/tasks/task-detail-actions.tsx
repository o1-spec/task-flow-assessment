"use client";

import { useRouter } from "next/navigation";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { TaskForm, type TaskFormValue } from "@/components/tasks/task-form";
import type { Task } from "@/lib/types";

async function getError(response: Response) {
  const body = await response.json().catch(() => null);
  const error = new Error(body?.message ?? "Request failed") as Error & { fields?: Record<string, string[]> };
  error.fields = body?.fields;
  return error;
}

export function TaskDetailActions({ task }: { task: Task }) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
      router.push("/");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not delete task");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" onClick={() => setEditOpen(true)}>
          <Pencil className="h-4 w-4" /> Edit task
        </Button>
        <Button variant="danger" onClick={() => setDeleteOpen(true)}>
          <Trash2 className="h-4 w-4" /> Delete
        </Button>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit task" description="Update the details, due date, or current status.">
        <TaskForm task={task} submitLabel="Save changes" onSubmit={update} />
      </Modal>

      <Modal open={deleteOpen} onClose={() => !deleting && setDeleteOpen(false)} title="Delete task?" description="This action permanently removes the task and cannot be undone.">
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setDeleteOpen(false)} disabled={deleting}>Cancel</Button>
          <Button variant="danger" onClick={remove} disabled={deleting}>{deleting ? "Deleting..." : "Delete task"}</Button>
        </div>
      </Modal>
    </>
  );
}
