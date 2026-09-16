import Link from "next/link";
import { CheckSquare2 } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-indigo-100/50 blur-3xl" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 group">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-950 text-white shadow-sm transition group-hover:bg-slate-800">
            <CheckSquare2 className="h-5 w-5" />
          </span>
          <span className="text-2xl font-bold tracking-tight text-slate-950">
            TaskFlow
          </span>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[440px]">
        <div className="bg-white py-8 px-5 sm:px-10 shadow-xl shadow-slate-200/50 sm:rounded-3xl border border-slate-200/80">
          {children}
        </div>

        <div className="mt-6 text-center text-xs text-slate-400">
          TaskFlow Assessment • Secure Session Authentication
        </div>
      </div>
    </div>
  );
}
