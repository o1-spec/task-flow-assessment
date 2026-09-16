import { redirect } from "next/navigation";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Dashboard — TaskFlow",
  description: "Overview of your workspace tasks, progress, and upcoming deadlines.",
};

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return <DashboardView user={session} />;
}
