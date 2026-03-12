import type { LayoutMode } from "@widgets/country-explorer/model/layoutMode";
import { ExplorerLayoutTabs } from "@widgets/country-explorer/ui/ExplorerLayoutTabs.tsx";

interface ExplorerHeaderProps {
  layoutMode: LayoutMode;
  setLayoutMode: (mode: LayoutMode) => void;
}

export function ExplorerHeader({ layoutMode, setLayoutMode }: ExplorerHeaderProps) {
  return (
    <header className="mt-2 w-full max-w-7xl px-2 md:mt-4 md:px-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-amber-500/15 ring-1 ring-amber-400/50 shadow-sm shadow-amber-500/30">
            <span className="text-sm font-semibold tracking-tight text-amber-200">O</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold tracking-tight text-zinc-50">Orbia</span>
            <span className="text-xs text-zinc-500">
              Interactive world explorer for every country
            </span>
          </div>
        </div>
        <ExplorerLayoutTabs layoutMode={layoutMode} setLayoutMode={setLayoutMode} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-zinc-500 md:text-sm">
        <p>
          Hover the globe or use the table to discover countries. Press <kbd>Esc</kbd> to clear
          selection.
        </p>
      </div>
    </header>
  );
}
