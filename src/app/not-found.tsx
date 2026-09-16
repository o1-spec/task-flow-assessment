import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6 py-12 text-center">
      <div>
        <div className="text-sm font-bold text-indigo-600">404</div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Task not found</h1>
        <p className="mt-2 text-sm text-slate-500">It may have been deleted or the link is incorrect.</p>
        <Link href="/" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-800 hover:text-indigo-700">
          <ArrowLeft className="h-4 w-4" /> Back to tasks
        </Link>
      </div>
    </div>
  );
}
