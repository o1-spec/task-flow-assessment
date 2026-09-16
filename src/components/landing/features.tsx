import {
  CalendarDays,
  CheckCircle2,
  Filter,
  ListTodo,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";

const features = [
  {
    title: "Organize your tasks",
    description:
      "Capture tasks with detailed descriptions, priority statuses, and structured fields designed for clarity.",
    icon: ListTodo,
  },
  {
    title: "Track deadlines",
    description:
      "Always know what is due next with normalized UTC due-date tracking and upcoming deadline summaries.",
    icon: CalendarDays,
  },
  {
    title: "Monitor progress",
    description:
      "Visual completion metrics and dashboard breakdown let you evaluate daily throughput at a single glance.",
    icon: TrendingUp,
  },
  {
    title: "Search and filter tasks",
    description:
      "Quickly find tasks across titles and descriptions. Filter by status or sort by due date with zero lag.",
    icon: Filter,
  },
  {
    title: "Stay aware of overdue work",
    description:
      "Automatically calculated overdue indicators highlight tasks that need immediate attention before it's too late.",
    icon: AlertTriangle,
  },
  {
    title: "Isolated private workspaces",
    description:
      "Strict server-enforced ownership ensures only you can view, modify, or delete your workspace tasks.",
    icon: CheckCircle2,
  },
];

export function LandingFeatures() {
  return (
    <section id="features" className="py-20 bg-white border-y border-slate-200/80 scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
            Engineered for productivity
          </h2>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Everything you need. Nothing you don't.
          </h3>
          <p className="mt-3.5 text-base text-slate-600">
            A fast, uncluttered task manager that focuses on high-impact workflows and dependable performance.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200/90 bg-slate-50/50 p-6 transition hover:border-slate-300 hover:bg-white hover:shadow-md"
              >
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-white border border-slate-200 text-slate-900 shadow-xs group-hover:bg-slate-950 group-hover:text-white transition">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="mt-5 text-lg font-bold text-slate-900">{feature.title}</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
