import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

export function toDateInputValue(date: string | Date) {
  return new Date(date).toISOString().slice(0, 10);
}


export function isTaskOverdue(dueDate: string | Date, status: string) {
  if (status === "COMPLETED") return false;
  const todayUtc = new Date();
  todayUtc.setUTCHours(0, 0, 0, 0);
  return new Date(dueDate).getTime() < todayUtc.getTime();
}
