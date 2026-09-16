"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="grid min-h-[70vh] place-items-center px-6 py-12 text-center">
      <div className="max-w-md">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-rose-50 text-rose-600">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-slate-950">Something went wrong</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">
          The page could not be loaded. Your data has not been changed.
        </p>
        <Button className="mt-5" onClick={reset}>Try again</Button>
      </div>
    </div>
  );
}
