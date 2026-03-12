import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@shared/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "icon";
type ButtonSize = "sm" | "md" | "lg" | "icon";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-amber-500 text-zinc-950 shadow hover:bg-amber-400 focus-visible:ring-amber-400 focus-visible:ring-offset-zinc-950",
  secondary:
    "border border-zinc-600 bg-zinc-800 text-zinc-100 shadow-sm hover:bg-zinc-700 focus-visible:ring-amber-400 focus-visible:ring-offset-zinc-950",
  outline:
    "border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-sm hover:bg-zinc-800 focus-visible:ring-amber-400 focus-visible:ring-offset-zinc-950",
  ghost:
    "bg-transparent text-zinc-200 hover:bg-zinc-800/80 focus-visible:ring-amber-400 focus-visible:ring-offset-zinc-950",
  icon: "border border-zinc-700 bg-zinc-900 text-zinc-100 shadow-md hover:bg-zinc-800 active:scale-95 active:bg-zinc-700 focus-visible:ring-amber-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-2 py-1 text-xs",
  md: "px-3 py-2 text-sm",
  lg: "px-4 py-2.5 text-sm",
  icon: "min-h-[44px] min-w-[44px] px-0 py-0 text-base",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(props, ref) {
  const { className, variant = "primary", size = "md", type = "button", ...rest } = props;

  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
});
