import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "TaskFlow — Stay Focused. Get Things Done.",
  description:
    "A production-grade task management SaaS built with Next.js, TypeScript, Prisma, and PostgreSQL. Track deadlines, monitor progress, and manage work clearly.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#f8fafc] text-slate-900 antialiased selection:bg-indigo-100 selection:text-indigo-900">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
