import { redirect } from "next/navigation";
import { SettingsView } from "@/components/settings/settings-view";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Settings — TaskFlow",
  description: "Account and security preferences.",
};

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return <SettingsView user={session} />;
}
