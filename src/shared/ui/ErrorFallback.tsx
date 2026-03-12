import { cn } from "@shared/lib/utils";
import { Button } from "@shared/ui";

interface ErrorFallbackProps {
  error: Error;
  reset: () => void;
  className?: string;
}

export function ErrorFallback({ error, reset, className }: ErrorFallbackProps) {
  return (
    <div
      className={cn("flex min-h-screen items-center justify-center bg-zinc-950 px-4", className)}
    >
      <div className="max-w-md rounded-2xl border border-red-500/40 bg-zinc-900/80 p-6 text-center shadow-xl shadow-red-900/40 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-400">
          Unexpected error
        </p>
        <h1 className="mt-3 text-xl font-semibold text-zinc-50 sm:text-2xl">
          Something went wrong
        </h1>
        <p className="mt-2 text-xs text-zinc-500 sm:text-sm">
          We&apos;re sorry — an error occurred while rendering this page.
        </p>
        <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-black/60 p-3 text-left text-xs text-red-300">
          {error.message}
        </pre>
        <Button className="mt-5" variant="primary" size="md" onClick={reset}>
          Try again
        </Button>
      </div>
    </div>
  );
}
