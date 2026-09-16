import Link from "next/link";
import { CheckSquare2 } from "lucide-react";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-sm text-slate-500">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-slate-950 text-white shadow-xs">
              <CheckSquare2 className="h-4 w-4" />
            </span>
            <span className="font-bold tracking-tight text-slate-900">TaskFlow</span>
            <span className="text-xs text-slate-400">
              • Software Engineering Assessment
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
            <Link href="#features" className="hover:text-slate-900 transition">
              Product
            </Link>
            <Link href="/login" className="hover:text-slate-900 transition">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-slate-900 transition">
              Register
            </Link>
            <span className="text-slate-400">Privacy</span>
            <span className="text-slate-400">Terms</span>
          </div>

          <p className="text-xs text-slate-400">
            © {year} TaskFlow. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
