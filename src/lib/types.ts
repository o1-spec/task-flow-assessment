export type TaskStatus = "TODO" | "IN_PROGRESS" | "COMPLETED";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
};

export type TaskSummary = {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

export type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
};

export type SessionUser = {
  id: string;
  email: string;
  name: string;
};
