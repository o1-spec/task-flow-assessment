import { Check, Plus, UserPlus } from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Create an account",
    description:
      "Sign up in seconds with your name and email. Your credentials are fully protected with industry-standard bcrypt hashing.",
    icon: UserPlus,
  },
  {
    step: "02",
    title: "Add your tasks",
    description:
      "Define actionable tasks with descriptions, priority states, and due dates. Organize your workload cleanly.",
    icon: Plus,
  },
  {
    step: "03",
    title: "Track and complete your work",
    description:
      "Sort and filter as your day unfolds, monitor overdue items, and mark tasks completed as milestones are reached.",
    icon: Check,
  },
];

export function LandingHowItWorks() {
  return (
    <section id="how-it-works" className="py-20 bg-[#f8fafc] scroll-mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
            Simple Workflow
          </h2>
          <h3 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
            Get up and running in minutes
          </h3>
          <p className="mt-3.5 text-base text-slate-600">
            TaskFlow is built without steep learning curves so you can jump straight into getting work done.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={item.step}
                className="relative flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-xs transition hover:border-slate-300 hover:shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-slate-900 font-bold text-base">
                    <Icon className="h-5 w-5 text-indigo-600" />
                  </span>
                  <span className="text-2xl font-black text-slate-200">
                    {item.step}
                  </span>
                </div>

                <h4 className="mt-6 text-xl font-bold text-slate-900">
                  {item.title}
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                    {/* Visual connector */}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
