import type { ReactNode } from "react";
import { Button } from "@shared/ui";

interface ExplorerErrorPanelProps {
  message?: ReactNode;
  onRetry: () => void;
}

export function ExplorerErrorPanel({ message, onRetry }: ExplorerErrorPanelProps) {
  return (
    <div className="flex flex-col gap-3 p-4 text-sm text-red-400">
      <p>Failed to load countries list. {message}</p>
      <Button type="button" variant="secondary" size="lg" onClick={onRetry} className="rounded-xl">
        Retry
      </Button>
    </div>
  );
}
