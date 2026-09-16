import * as React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  const variants = {
    primary:
      "bg-slate-950 text-white shadow-sm hover:bg-slate-800 focus-visible:ring-slate-400",
    secondary:
      "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus-visible:ring-slate-300",
    ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus-visible:ring-slate-300",
    danger:
      "bg-rose-600 text-white hover:bg-rose-700 focus-visible:ring-rose-300",
  };
  const sizes = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-11 px-5 text-sm",
  };

  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-4",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
}
