import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { NotFoundPage } from "@pages/not-found";

export function RouteErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    if (error.status === 404) {
      return <NotFoundPage />;
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-md text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
            {error.status}
          </p>
          <h1 className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">
            {error.statusText || "Unexpected error"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {error.data && typeof error.data === "string"
              ? error.data
              : "Something went wrong while loading this page."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4">
      <div className="max-w-md text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">Error</p>
        <h1 className="mt-3 text-2xl font-semibold text-zinc-50 sm:text-3xl">
          Something went wrong
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Try refreshing the page. If the problem persists, please contact support.
        </p>
      </div>
    </div>
  );
}
