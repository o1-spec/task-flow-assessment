"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckSquare2, Menu, X, ArrowRight, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNavbar({
  user,
}: {
  user?: { name: string; email: string } | null;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur-md transition">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 transition hover:opacity-90">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-950 text-white shadow-sm">
            <CheckSquare2 className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-950">TaskFlow</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <a
            href="#features"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="text-sm font-medium text-slate-600 transition hover:text-slate-950"
          >
            How it Works
          </a>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/settings"
                className="flex items-center gap-2 rounded-xl border border-slate-200/90 bg-slate-50/80 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-white hover:text-slate-950 transition shadow-2xs"
                title="Account Settings"
              >
                <span className="grid h-6 w-6 place-items-center rounded-lg bg-indigo-100 text-indigo-700">
                  <User className="h-3.5 w-3.5" />
                </span>
                <span>{user.name}</span>
              </Link>
              <Link href="/dashboard">
                <Button size="sm" className="bg-slate-950 text-white hover:bg-slate-800">
                  Go to Dashboard
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="text-slate-700 hover:text-slate-950">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm" className="bg-slate-950 text-white hover:bg-slate-800 shadow-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex md:hidden">
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-b border-slate-200 bg-white px-4 py-5 shadow-lg md:hidden">
          <nav className="flex flex-col gap-3">
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              How it Works
            </a>
            <div className="my-2 border-t border-slate-100 pt-3 flex flex-col gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100 mb-1">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-indigo-100 text-indigo-700">
                      <User className="h-4 w-4" />
                    </span>
                    <span className="text-sm font-semibold text-slate-800 truncate">
                      {user.name}
                    </span>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center bg-slate-950 text-white">
                      Go to Dashboard
                    </Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="secondary" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full justify-center bg-slate-950 text-white">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
