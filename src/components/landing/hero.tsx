import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock3, Circle, Filter, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 sm:pt-16 sm:pb-24 lg:pt-20 lg:pb-32">
      {/* Subtle background ambient mesh */}
      <div className="pointer-events-none absolute inset-0 -z-10 flex items-center justify-center">
        <div className="h-[480px] w-[700px] rounded-full bg-gradient-to-tr from-indigo-100/60 to-slate-100/80 blur-3xl opacity-70" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Release badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3.5 py-1 text-xs font-semibold text-slate-700 shadow-sm backdrop-blur mb-6">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            TaskFlow 2.0 • Production Task Management
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
            Stay focused. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-slate-950 via-slate-800 to-indigo-900 bg-clip-text text-transparent">
              Get things done.
            </span>
          </h1>

          <p className="mt-5 text-base sm:text-lg leading-7 sm:leading-8 text-slate-600 max-w-2xl mx-auto">
            TaskFlow helps modern professionals and engineering teams organize tasks, track approaching deadlines, and maintain clarity without unnecessary complexity.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
            <Link href="/register" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-slate-950 text-white hover:bg-slate-800 shadow-md">
                Get Started Free
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto text-slate-800">
                Sign In
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Free demo account
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> PostgreSQL backed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Private & user-scoped
            </span>
          </div>
        </div>

        {/* Tasteful Dashboard Preview */}
        <div className="mt-14 sm:mt-18 rounded-3xl border border-slate-200/90 bg-white p-2.5 sm:p-4 shadow-xl shadow-slate-200/50 max-w-5xl mx-auto transition hover:shadow-2xl">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 sm:p-6">
            {/* Header bar mock */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/70 pb-4">
              <div>
                <h3 className="text-base font-bold text-slate-950">Workspace Overview</h3>
                <p className="text-xs text-slate-500">5 active tasks • 1 due today</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600">
                  <Search className="h-3.5 w-3.5 text-slate-400" />
                  <span>Search tasks...</span>
                </div>
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-600">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <span>All statuses</span>
                </div>
                <div className="flex items-center gap-1 rounded-lg bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white">
                  <Plus className="h-3.5 w-3.5" />
                  <span>New Task</span>
                </div>
              </div>
            </div>

            {/* Task list preview */}
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {/* Task 1 */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-semibold text-amber-800">
                    <Clock3 className="h-3 w-3" /> In progress
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">Tomorrow</span>
                </div>
                <h4 className="mt-2.5 text-sm font-bold text-slate-900 line-clamp-1">
                  Deliver API Documentation
                </h4>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  Finalize schemas, request headers, and response status codes.
                </p>
              </div>

              {/* Task 2 */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                    <Circle className="h-3 w-3" /> To do
                  </span>
                  <span className="text-[11px] font-medium text-slate-400">In 3 days</span>
                </div>
                <h4 className="mt-2.5 text-sm font-bold text-slate-900 line-clamp-1">
                  Database Migration Run
                </h4>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  Apply foreign keys and compound performance indexes on user IDs.
                </p>
              </div>

              {/* Task 3 */}
              <div className="rounded-xl border border-slate-200/90 bg-white p-4 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                    <CheckCircle2 className="h-3 w-3" /> Completed
                  </span>
                  <span className="text-[11px] font-medium text-emerald-600">Done</span>
                </div>
                <h4 className="mt-2.5 text-sm font-bold text-slate-900 line-clamp-1">
                  Security Headers Config
                </h4>
                <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  Verify X-Frame-Options, CSP, and strict cookie security.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
