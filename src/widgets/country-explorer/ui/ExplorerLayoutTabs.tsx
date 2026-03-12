import type { LayoutMode } from "@widgets/country-explorer/model/layoutMode";
import { Button } from "@shared/ui";

interface ExplorerLayoutTabsProps {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

export function ExplorerLayoutTabs({ layoutMode, setLayoutMode }: ExplorerLayoutTabsProps) {
  return (
    <div className="hidden items-center gap-1 rounded-full border border-zinc-700/80 bg-zinc-900/80 p-0.5 text-xs text-zinc-300 shadow-sm shadow-black/40 backdrop-blur md:flex">
      <Button
        type="button"
        size="sm"
        variant={layoutMode === "table" ? "primary" : "ghost"}
        onClick={() => setLayoutMode("table")}
        className="rounded-full px-2 py-1"
      >
        Focus table
      </Button>
      <Button
        type="button"
        size="sm"
        variant={layoutMode === "balanced" ? "primary" : "ghost"}
        onClick={() => setLayoutMode("balanced")}
        className="rounded-full px-2 py-1"
      >
        Balanced
      </Button>
      <Button
        type="button"
        size="sm"
        variant={layoutMode === "globe" ? "primary" : "ghost"}
        onClick={() => setLayoutMode("globe")}
        className="rounded-full px-2 py-1"
      >
        Focus globe
      </Button>
    </div>
  );
}
