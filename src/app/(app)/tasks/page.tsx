import { TaskDashboard } from "@/components/tasks/task-dashboard";

export const metadata = {
  title: "My Tasks — TaskFlow",
  description: "Manage, filter, search, and track your tasks.",
};

export default function TasksPage() {
  return <TaskDashboard />;
}
