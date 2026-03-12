export function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-amber-400">404</p>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">Page not found</h1>
        <p className="mt-2 text-sm text-zinc-400">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>
        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center rounded-xl border border-amber-500/70 bg-amber-500 px-4 py-2.5 text-sm font-medium text-zinc-950 shadow-sm hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          Back to globe
        </a>
      </div>
    </div>
  );
}
