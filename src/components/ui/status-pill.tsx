import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";
import type { TaskStatus } from "@/lib/types";
import { cn } from "@/lib/utils";

const config = {
  TODO: {
    label: "To do",
    className: "border-slate-200 bg-slate-100 text-slate-700",
    icon: Circle,
  },
  IN_PROGRESS: {
    label: "In progress",
    className: "border-amber-200 bg-amber-50 text-amber-800",
    icon: LoaderCircle,
  },
  COMPLETED: {
    label: "Completed",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircle2,
  },
} satisfies Record<TaskStatus, { label: string; className: string; icon: typeof Circle }>;

export function StatusPill({ status }: { status: TaskStatus }) {
  const item = config[status];
  const Icon = item.icon;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        item.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {item.label}
    </span>
  );
}
