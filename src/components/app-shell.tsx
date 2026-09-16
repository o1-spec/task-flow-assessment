"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CheckSquare2,
  LayoutDashboard,
  ListTodo,
  LogOut,
  Menu,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import type { SessionUser } from "@/lib/types";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/tasks", label: "My Tasks", icon: ListTodo },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function AppShell({
  user,
  children,
}: {
  user: SessionUser;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Signed out");
      setShowLogoutDialog(false);
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out");
    } finally {
      setLoggingOut(false);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-200 bg-white px-4 py-5 text-slate-900 lg:flex z-30">
        <Link href="/dashboard" className="flex items-center gap-3 px-2 py-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-950 text-white shadow-xs">
            <CheckSquare2 className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[15px] font-bold tracking-tight text-slate-950">TaskFlow</div>
            <div className="text-[11px] text-slate-500">Focused work, clearly.</div>
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="mt-8 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-slate-100 font-bold text-slate-950 shadow-xs"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                )}
              >
                <Icon className={cn("h-4 w-4", active ? "text-slate-950" : "text-slate-500")} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Focus Callout */}
        <div className="mt-auto mb-4 rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5">
          <div className="mb-1.5 flex items-center gap-2 text-xs font-semibold text-slate-800">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Stay focused
          </div>
          <p className="text-[11px] leading-4 text-slate-500">
            Prioritize what matters, keep due dates visible, and close the loop.
          </p>
        </div>

        {/* User Profile & Logout */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center justify-between gap-2 px-1">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200/60">
                {getInitials(user.name)}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
              </div>
            </div>

            <button
              onClick={() => setShowLogoutDialog(true)}
              disabled={loggingOut}
              title="Sign out"
              aria-label="Sign out"
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-200/80 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link href="/dashboard" className="inline-flex items-center gap-2 font-bold text-slate-950">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-slate-950 text-white">
            <CheckSquare2 className="h-4 w-4" />
          </span>
          TaskFlow
        </Link>

        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-100 text-indigo-800 text-xs font-bold">
            {getInitials(user.name)}
          </span>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[57px] z-20 bg-slate-950/40 backdrop-blur-xs lg:hidden">
          <div className="border-b border-slate-200 bg-white p-4 shadow-xl">
            <div className="mb-4 flex items-center gap-3 border-b border-slate-100 pb-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-100 text-indigo-800 text-sm font-bold">
                {getInitials(user.name)}
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">{user.name}</p>
                <p className="text-xs text-slate-500">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const active =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                      active
                        ? "bg-slate-100 font-bold text-slate-950"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 border-t border-slate-100 pt-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowLogoutDialog(true);
                }}
                disabled={loggingOut}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50 transition"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="lg:pl-64">
        <main>{children}</main>
      </div>

      {/* Sign Out Confirmation Dialog */}
      <Modal
        open={showLogoutDialog}
        onClose={() => !loggingOut && setShowLogoutDialog(false)}
        title="Sign out of TaskFlow?"
        description="Are you sure you want to end your current session? You will need to enter your email and password to access your tasks again."
        size="sm"
      >
        <div className="mt-6 flex justify-end gap-2.5">
          <Button
            variant="secondary"
            onClick={() => setShowLogoutDialog(false)}
            disabled={loggingOut}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            {loggingOut ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
