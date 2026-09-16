"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LogOut,
  ShieldCheck,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { SessionUser } from "@/lib/types";

export function SettingsView({ user }: { user: SessionUser }) {
  const router = useRouter();

  // Profile update state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [updatingProfile, setUpdatingProfile] = useState(false);

  // Password update state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingProfile(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      toast.success("Profile updated successfully");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error updating profile");
    } finally {
      setUpdatingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }

    setUpdatingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update password");

      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error changing password");
    } finally {
      setUpdatingPassword(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      toast.success("Signed out");
      router.push("/login");
      router.refresh();
    } catch {
      toast.error("Could not sign out");
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-7 sm:px-6 lg:px-8 lg:py-9">
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-3xl font-bold tracking-tight text-slate-950">Settings</h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your profile, account preferences, and workspace security.
        </p>
      </div>

      <div className="mt-8 space-y-8">
        {/* Profile Settings */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-100">
              <User className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-950">Profile Information</h2>
              <p className="text-xs text-slate-500">Update your name and primary email address.</p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="mt-6 space-y-4 max-w-lg">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
              />
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm" disabled={updatingProfile} className="bg-slate-950 text-white">
                {updatingProfile ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Save profile
              </Button>
            </div>
          </form>
        </section>

        {/* Password Security */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-50 text-amber-800 border border-amber-100">
              <KeyRound className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-950">Change Password</h2>
              <p className="text-xs text-slate-500">Ensure your account uses a strong, unique password.</p>
            </div>
          </div>

          <form onSubmit={handleChangePassword} className="mt-6 space-y-4 max-w-lg">
            <div>
              <label htmlFor="currentPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Current password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showCurrentPassword ? "Hide current password" : "Show current password"}
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="newPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                New password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showNewPassword ? "Hide new password" : "Show new password"}
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmNewPassword" className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                Confirm new password
              </label>
              <div className="relative mt-1.5">
                <input
                  id="confirmNewPassword"
                  type={showConfirmNewPassword ? "text" : "password"}
                  required
                  value={confirmNewPassword}
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="block w-full rounded-xl border border-slate-200 bg-white pl-3.5 pr-10 py-2.5 text-sm text-slate-900 outline-none transition focus:border-slate-400 focus:ring-4 focus:ring-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showConfirmNewPassword ? "Hide password confirmation" : "Show password confirmation"}
                >
                  {showConfirmNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" size="sm" disabled={updatingPassword} className="bg-slate-950 text-white">
                {updatingPassword ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Update password
              </Button>
            </div>
          </form>
        </section>

        {/* Session & Security Overview */}
        <section className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-xs sm:p-7">
          <div className="flex items-center gap-3 pb-5 border-b border-slate-100">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-950">Session & Security</h2>
              <p className="text-xs text-slate-500">Security parameters for your active session.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold text-slate-500">Session Type</p>
              <p className="mt-1 text-sm font-bold text-slate-900">HTTP-only Signed Cookie</p>
              <p className="mt-1 text-[11px] text-slate-500">Protected against client-side script theft (XSS).</p>
            </div>

            <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-4">
              <p className="text-xs font-semibold text-slate-500">Cookie Flags</p>
              <p className="mt-1 text-sm font-bold text-slate-900">SameSite=Lax • Secure in Prod</p>
              <p className="mt-1 text-[11px] text-slate-500">Guards against Cross-Site Request Forgery (CSRF).</p>
            </div>
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-slate-900">Sign out of this session</p>
              <p className="text-xs text-slate-500">Clears your session cookie and returns you to the login screen.</p>
            </div>
            <Button variant="danger" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
