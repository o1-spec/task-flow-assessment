"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CheckSquare2, LayoutDashboard, ListTodo, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Overview", icon: LayoutDashboard },
  { href: "/#tasks", label: "Tasks", icon: ListTodo },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="min-h-screen bg-[#f6f7fb] text-slate-950">
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-slate-800/80 bg-[#0e1628] px-4 py-5 text-white lg:flex">
        <Link href="/" className="flex items-center gap-3 px-2 py-2">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-slate-950 shadow-lg shadow-black/20">
            <CheckSquare2 className="h-5 w-5" />
          </span>
          <div>
            <div className="text-[15px] font-bold tracking-tight">TaskFlow</div>
            <div className="text-[11px] text-slate-400">Focused work, clearly.</div>
          </div>
        </Link>

        <nav className="mt-8 space-y-1">
          {navigation.map((item, index) => {
            const Icon = item.icon;
            const active = index === 0 ? pathname === "/" : pathname.startsWith("/tasks");
            return (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-white/10 text-white"
                    : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-200",
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.05] p-4">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-indigo-300" />
            Stay focused
          </div>
          <p className="text-xs leading-5 text-slate-400">
            Prioritise what matters, keep due dates visible, and close the loop on every task.
          </p>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-[#f6f7fb]/90 px-4 py-3 backdrop-blur lg:hidden">
          <Link href="/" className="inline-flex items-center gap-2 font-bold">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white">
              <CheckSquare2 className="h-4 w-4" />
            </span>
            TaskFlow
          </Link>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}
